# Agent Chrome MCP Release Install

## Download

Download the latest `agent-chrome-mcp-extension.zip` from:

https://github.com/rudy2steiner/chrome-mcp/releases/latest

## Install The Chrome Extension

1. Unzip `agent-chrome-mcp-extension.zip`.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the unzipped extension folder.

## Add The MCP Server

Recommended config:

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "npx",
      "args": ["-y", "--package", "agent-chrome-mcp", "agent-chrome-mcp-stdio"]
    }
  }
}
```

Or install the native bridge globally:

```bash
npm install -g agent-chrome-mcp
```

Then use:

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "agent-chrome-mcp-stdio",
      "args": []
    }
  }
}
```

The HTTP endpoint is `http://127.0.0.1:12307/mcp` after the extension starts the local bridge.
