import { ToolExecutor } from '@/common/tool-handler';
import type { ToolResult } from '@/common/tool-handler';
import { TIMEOUTS, ERROR_MESSAGES } from '@/common/constants';

const PING_TIMEOUT_MS = 300;

export type TabResolutionMeta = {
  requestedTabId: number | null;
  resolvedTabId: number;
  fellBack: boolean;
  warnings?: string[];
};

/**
 * Base class for browser tool executors
 */
export abstract class BaseBrowserToolExecutor implements ToolExecutor {
  abstract name: string;
  abstract execute(args: any): Promise<ToolResult>;

  /**
   * Inject content script into tab
   */
  protected async injectContentScript(
    tabId: number,
    files: string[],
    injectImmediately = false,
    world: 'MAIN' | 'ISOLATED' = 'ISOLATED',
    allFrames: boolean = false,
    frameIds?: number[],
  ): Promise<void> {
    console.log(`Injecting ${files.join(', ')} into tab ${tabId}`);

    // check if script is already injected
    try {
      const pingFrameId = frameIds?.[0];
      const response = await Promise.race([
        typeof pingFrameId === 'number'
          ? chrome.tabs.sendMessage(
              tabId,
              { action: `${this.name}_ping` },
              { frameId: pingFrameId },
            )
          : chrome.tabs.sendMessage(tabId, { action: `${this.name}_ping` }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`${this.name} Ping action to tab ${tabId} timed out`)),
            PING_TIMEOUT_MS,
          ),
        ),
      ]);

      if (response && response.status === 'pong') {
        console.log(
          `pong received for action '${this.name}' in tab ${tabId}. Assuming script is active.`,
        );
        return;
      } else {
        console.warn(`Unexpected ping response in tab ${tabId}:`, response);
      }
    } catch (error) {
      console.error(
        `ping content script failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    try {
      const target: { tabId: number; allFrames?: boolean; frameIds?: number[] } = { tabId };
      if (frameIds && frameIds.length > 0) {
        target.frameIds = frameIds;
      } else if (allFrames) {
        target.allFrames = true;
      }
      await chrome.scripting.executeScript({
        target,
        files,
        injectImmediately,
        world,
      } as any);
      console.log(`'${files.join(', ')}' injection successful for tab ${tabId}`);
    } catch (injectionError) {
      const errorMessage =
        injectionError instanceof Error ? injectionError.message : String(injectionError);
      console.error(
        `Content script '${files.join(', ')}' injection failed for tab ${tabId}: ${errorMessage}`,
      );
      throw new Error(
        `${ERROR_MESSAGES.TOOL_EXECUTION_FAILED}: Failed to inject content script in tab ${tabId}: ${errorMessage}`,
      );
    }
  }

  /**
   * Send message to tab
   */
  protected async sendMessageToTab(tabId: number, message: any, frameId?: number): Promise<any> {
    try {
      const response =
        typeof frameId === 'number'
          ? await chrome.tabs.sendMessage(tabId, message, { frameId })
          : await chrome.tabs.sendMessage(tabId, message);

      if (response && response.error) {
        throw new Error(String(response.error));
      }

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(
        `Error sending message to tab ${tabId} for action ${message?.action || 'unknown'}: ${errorMessage}`,
      );

      if (error instanceof Error) {
        throw error;
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * Coerce a tab/window id that may arrive as a numeric string from MCP clients.
   * Throws when the value is present but not a finite number.
   */
  protected coerceId(value: unknown, label: string): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim() !== '') {
      const n = Number(value);
      if (Number.isFinite(n)) return n;
    }
    throw new Error(`Invalid ${label}: ${JSON.stringify(value)} (expected number)`);
  }

  /**
   * Try to get an existing tab by id. Returns null when absent or not found.
   * Invalid non-numeric values throw (do not silently ignore).
   */
  protected async tryGetTab(tabId?: unknown): Promise<chrome.tabs.Tab | null> {
    const id = this.coerceId(tabId, 'tabId');
    if (id === undefined) return null;
    try {
      return await chrome.tabs.get(id);
    } catch {
      return null;
    }
  }

  /**
   * Resolve the tab a tool should operate on.
   * - Explicit tabId: must resolve; failure throws (no silent fallback).
   * - No tabId: use active tab in windowId / last-focused window; fellBack=true.
   */
  protected async resolveTargetTab(args: {
    tabId?: unknown;
    windowId?: unknown;
  }): Promise<{ tab: chrome.tabs.Tab; meta: TabResolutionMeta }> {
    const requestedTabId = this.coerceId(args.tabId, 'tabId');
    const windowId = this.coerceId(args.windowId, 'windowId');

    if (requestedTabId !== undefined) {
      try {
        const tab = await chrome.tabs.get(requestedTabId);
        if (!tab?.id) {
          throw new Error(`Tab not found: ${requestedTabId}`);
        }
        return {
          tab,
          meta: {
            requestedTabId,
            resolvedTabId: tab.id,
            fellBack: false,
          },
        };
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Tab not found: ${requestedTabId} (${reason.includes('Tab not found') ? 'does not exist or no permission' : reason})`,
        );
      }
    }

    const tab = await this.getActiveTabOrThrowInWindow(windowId);
    if (!tab.id) throw new Error('Active tab not found');
    const warning =
      windowId !== undefined
        ? `No tabId provided; operated on active tab ${tab.id} in window ${windowId}`
        : `No tabId provided; operated on last-focused window active tab ${tab.id}`;
    return {
      tab,
      meta: {
        requestedTabId: null,
        resolvedTabId: tab.id,
        fellBack: true,
        warnings: [warning],
      },
    };
  }

  /**
   * Merge tab resolution metadata into a tool JSON payload.
   */
  protected withTabMeta<T extends Record<string, unknown>>(
    payload: T,
    meta: TabResolutionMeta,
  ): T & TabResolutionMeta {
    const existingWarnings = Array.isArray((payload as { warnings?: unknown }).warnings)
      ? ((payload as { warnings: string[] }).warnings as string[])
      : [];
    const warnings = [...existingWarnings, ...(meta.warnings || [])];
    return {
      ...payload,
      requestedTabId: meta.requestedTabId,
      resolvedTabId: meta.resolvedTabId,
      fellBack: meta.fellBack,
      ...(warnings.length ? { warnings } : {}),
    };
  }

  protected jsonWithTabMeta(
    payload: Record<string, unknown>,
    meta: TabResolutionMeta,
    isError = false,
  ): ToolResult {
    return {
      content: [{ type: 'text', text: JSON.stringify(this.withTabMeta(payload, meta)) }],
      isError,
    };
  }

  /**
   * Inject tab resolution meta into an existing ToolResult JSON payload.
   */
  protected attachTabMeta(result: ToolResult, meta: TabResolutionMeta): ToolResult {
    if (result?.isError) return result;
    try {
      const block = result?.content?.[0] as { type?: string; text?: string } | undefined;
      if (block?.type === 'text' && typeof block.text === 'string') {
        const parsed = JSON.parse(block.text);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return {
            ...result,
            content: [
              {
                type: 'text',
                text: JSON.stringify(this.withTabMeta(parsed as Record<string, unknown>, meta)),
              },
            ],
          };
        }
      }
    } catch {
      // leave payload unchanged if it is not JSON
    }
    return result;
  }

  /**
   * Get the active tab in the current window. Throws when not found.
   */
  protected async getActiveTabOrThrow(): Promise<chrome.tabs.Tab> {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!active || !active.id) throw new Error('Active tab not found');
    return active;
  }

  /**
   * Whether tool calls should avoid activating the tab / focusing the window.
   * Default is true: do not steal focus unless the caller explicitly sets
   * `background: false` (Claude-in-Chrome style).
   */
  protected stayInBackground(background?: boolean): boolean {
    return background !== false;
  }

  /**
   * Optionally focus window and/or activate tab. Both are opt-in
   * (`activate` / `focusWindow` must be explicitly true).
   */
  protected async ensureFocus(
    tab: chrome.tabs.Tab,
    options: { activate?: boolean; focusWindow?: boolean } = {},
  ): Promise<void> {
    const activate = options.activate === true;
    const focusWindow = options.focusWindow === true;
    if (focusWindow && typeof tab.windowId === 'number') {
      await chrome.windows.update(tab.windowId, { focused: true });
    }
    if (activate && typeof tab.id === 'number') {
      await chrome.tabs.update(tab.id, { active: true });
    }
  }

  /**
   * Get the active tab. When windowId provided, search within that window; otherwise currentWindow.
   */
  protected async getActiveTabInWindow(windowId?: number): Promise<chrome.tabs.Tab | null> {
    if (typeof windowId === 'number') {
      const tabs = await chrome.tabs.query({ active: true, windowId });
      return tabs && tabs[0] ? tabs[0] : null;
    }
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs && tabs[0] ? tabs[0] : null;
  }

  /**
   * Same as getActiveTabInWindow, but throws if not found.
   */
  protected async getActiveTabOrThrowInWindow(windowId?: number): Promise<chrome.tabs.Tab> {
    const tab = await this.getActiveTabInWindow(windowId);
    if (!tab || !tab.id) throw new Error('Active tab not found');
    return tab;
  }
}
