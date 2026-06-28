# Agent Chrome MCP Release Install

**📖 Documentation**: [English](README.md) | [中文](README_zh.md)

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

## Ask Your Agent To Install It

Copy this prompt into your agent:

```text
Install Agent Chrome MCP for this agent.

Use this MCP server config:

{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "npx",
      "args": ["-y", "--registry=https://registry.npmjs.org", "agent-chrome-mcp@latest", "stdio"]
    }
  }
}

Add it to this agent's MCP settings. Do not use a global npm install. After updating the config, tell me where you saved it and remind me to restart the agent. Also remind me to install the Chrome extension from https://github.com/rudy2steiner/chrome-mcp/releases/latest and click Connect in the extension popup.
```

Then restart the agent and click Connect in the extension popup.

## Manual MCP Config

If you prefer to edit the config yourself, add this to your agent MCP settings:

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "npx",
      "args": ["-y", "--registry=https://registry.npmjs.org", "agent-chrome-mcp@latest", "stdio"]
    }
  }
}
```

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

## Acknowledgements

Special thanks to the original [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome) project and its author, **hangye**, whose work laid the foundation for Agent Chrome MCP.
