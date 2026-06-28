# Agent Chrome MCP

**📖 Documentation**: [English](README.md) | [中文](README_zh.md)

Use your own Chrome browser as an MCP server for work automation agents and MCP-compatible clients.

Agent Chrome MCP lets an agent inspect and operate the Chrome browser you already use, including your existing login sessions, tabs, cookies, and extensions. It is useful for research, data entry, operations workflows, QA checks, content workflows, and coding tasks.

## Install

Most users should not install this package manually. Use it from your agent MCP configuration with `npx`.

### 1. Install The Chrome Extension

1. Download the latest `agent-chrome-mcp-extension.zip` from:
   https://github.com/rudy2steiner/chrome-mcp/releases/latest
2. Unzip it.
3. Open Chrome and go to `chrome://extensions/`.
4. Enable Developer mode.
5. Click Load unpacked.
6. Select the unzipped folder that contains `manifest.json`.

### 2. Ask Your Agent To Install It

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

### 3. Restart And Connect

Restart your agent. Then open the Agent Chrome MCP extension popup and click Connect.

After that, your agent should be able to list and call Chrome tools.

## Manual MCP Config

If you prefer to edit the MCP config yourself, add this to your agent MCP settings:

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

Then restart your agent and click Connect in the Chrome extension popup.

The explicit npm registry flag avoids failures on machines configured to use a private or mirrored npm registry that has not synced this package yet.

## Quick Test

Check that npm can run the bridge:

```bash
npx -y --registry=https://registry.npmjs.org agent-chrome-mcp@latest --version
```

For a real MCP stdio test, add the config above to your agent and restart it.

## Optional Global Install

If you prefer a global install:

```bash
npm install -g agent-chrome-mcp
```

Then use this MCP config:

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

## Troubleshooting

### npx says package not found

Your npm registry may be set to a private mirror. Use the explicit registry config:

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

Or change your npm registry:

```bash
npm config set registry https://registry.npmjs.org
```

### Extension cannot connect

Run:

```bash
npx -y --registry=https://registry.npmjs.org agent-chrome-mcp@latest doctor
```

To attempt automatic fixes:

```bash
npx -y --registry=https://registry.npmjs.org agent-chrome-mcp@latest doctor --fix
```

## What This Package Does

This package is the local MCP bridge that your agent starts. The Chrome extension connects to the local bridge, and the bridge exposes Chrome tools to your agent over MCP stdio.

Normal users only need:

1. Chrome extension
2. MCP config
3. Click Connect

No global npm install is required.

## License

MIT

## Acknowledgements

Special thanks to the original [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome) project and its author, **hangye**, whose work laid the foundation for Agent Chrome MCP.
