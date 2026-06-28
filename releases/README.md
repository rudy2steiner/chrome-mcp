# Agent Chrome MCP Release Install

## Download

Download the latest `agent-chrome-mcp-extension.zip` from:

https://github.com/rudy2steiner/chrome-mcp/releases/latest

## Install

1. Unzip `agent-chrome-mcp-extension.zip`.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the unzipped folder that contains `manifest.json`.
6. Open the Agent Chrome MCP extension popup and click Copy Configuration.

## Add The MCP Server To Your Agent

Paste this config into your agent MCP settings, then restart the agent:

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "npx",
      "args": ["-y", "agent-chrome-mcp@latest", "stdio"]
    }
  }
}
```

After the agent restarts, open the extension popup and click Connect.

## Advanced: Global Install

```bash
npm install -g agent-chrome-mcp
```

Then use:

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "agent-chrome-mcp",
      "args": ["stdio"]
    }
  }
}
```

## Advanced: HTTP

The HTTP endpoint is `http://127.0.0.1:12307/mcp` after the extension starts the local bridge. Prefer stdio unless your MCP client specifically needs HTTP.
