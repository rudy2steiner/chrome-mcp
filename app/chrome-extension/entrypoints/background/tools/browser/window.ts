import { createErrorResponse, ToolResult } from '@/common/tool-handler';
import { BaseBrowserToolExecutor } from '../base-browser';
import { TOOL_NAMES } from 'agent-chrome-mcp-shared';
import { findMcpTabGroup, MCP_TAB_GROUP_TITLE } from '@/utils/mcp-tab-group';

class WindowTool extends BaseBrowserToolExecutor {
  name = TOOL_NAMES.BROWSER.GET_WINDOWS_AND_TABS;
  async execute(): Promise<ToolResult> {
    try {
      const windows = await chrome.windows.getAll({ populate: true });
      const mcpGroup = await findMcpTabGroup();
      let tabCount = 0;

      // Last-focused window + its active tab = silent fallback target when tools omit tabId.
      const [fallbackActive] = await chrome.tabs.query({ active: true, currentWindow: true });
      const lastFocusedWindowId =
        typeof fallbackActive?.windowId === 'number' ? fallbackActive.windowId : null;
      const lastFocusedActiveTabId =
        typeof fallbackActive?.id === 'number' ? fallbackActive.id : null;

      const structuredWindows = windows.map((window) => {
        const isLastFocused = typeof window.id === 'number' && window.id === lastFocusedWindowId;
        const tabs =
          window.tabs?.map((tab) => {
            tabCount++;
            const inMcpGroup =
              mcpGroup != null && typeof tab.groupId === 'number' && tab.groupId === mcpGroup.id;
            const isFallbackTarget =
              isLastFocused && typeof tab.id === 'number' && tab.id === lastFocusedActiveTabId;
            return {
              tabId: tab.id || 0,
              url: tab.url || '',
              title: tab.title || '',
              active: tab.active || false,
              groupId: typeof tab.groupId === 'number' && tab.groupId >= 0 ? tab.groupId : null,
              mcpGroup: inMcpGroup,
              isLastFocusedWindowActiveTab: isFallbackTarget,
            };
          }) || [];

        return {
          windowId: window.id || 0,
          focused: window.focused === true,
          isLastFocused,
          tabs: tabs,
        };
      });

      const result = {
        windowCount: windows.length,
        tabCount: tabCount,
        // When tools omit tabId, operations fall back to this target.
        fallbackTarget: {
          windowId: lastFocusedWindowId,
          tabId: lastFocusedActiveTabId,
          description:
            'Last-focused window active tab. Tools that omit tabId operate here (fellBack:true).',
        },
        mcpGroup: mcpGroup
          ? {
              groupId: mcpGroup.id,
              windowId: mcpGroup.windowId,
              title: mcpGroup.title || MCP_TAB_GROUP_TITLE,
              color: mcpGroup.color,
            }
          : null,
        windows: structuredWindows,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
        isError: false,
      };
    } catch (error) {
      console.error('Error in WindowTool.execute:', error);
      return createErrorResponse(
        `Error getting windows and tabs information: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

export const windowTool = new WindowTool();
