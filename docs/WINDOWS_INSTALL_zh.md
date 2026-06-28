# windows 安装指南 🔧

**📖 文档**: [中文](WINDOWS_INSTALL_zh.md)

Agent Chrome MCP 在windows电脑的详细安装和配置步骤

## 📋 安装

1. **下载最新版本**
   - 从 https://github.com/rudy2steiner/chrome-mcp/releases/latest 下载 `agent-chrome-mcp-extension.zip`
   - 解压 zip 文件

2. **加载 Chrome 扩展**
   - 打开 Chrome 并访问 `chrome://extensions/`
   - 启用"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择包含 `manifest.json` 的解压目录
   - 点击 Agent Chrome MCP 插件图标
   - 点击"复制配置"
     <img width="475" alt="截屏2025-06-09 15 52 06" src="https://github.com/user-attachments/assets/241e57b8-c55f-41a4-9188-0367293dc5bc" />

3. **让 Agent 帮你安装**

把下面这段提示词发给 Agent：

```text
请为当前 Agent 安装 Agent Chrome MCP。

使用这个 MCP server 配置：

{
  "mcpServers": {
    "agent-chrome-mcp": {
      "command": "npx",
      "args": ["-y", "--registry=https://registry.npmjs.org", "agent-chrome-mcp@latest", "stdio"]
    }
  }
}

把它添加到当前 Agent 的 MCP 设置里。不要使用全局 npm install。更新配置后告诉我保存到了哪里，并提醒我重启 Agent。也提醒我从 https://github.com/rudy2steiner/chrome-mcp/releases/latest 安装 Chrome 扩展，并在扩展弹窗里点击"连接"。
```

4. **重启并连接**

重启 Agent。然后打开插件弹窗并点击"连接"。查看工具列表，如果能列出工具，说明已经可以使用了。

### 手动 MCP 配置

如果你想手动编辑配置，把下面配置添加到 Agent 的 MCP 设置里：

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

HTTP 方式只作为高级用法：扩展启动本地桥接后，端点是 `http://127.0.0.1:12307/mcp`。

```json
{
  "mcpServers": {
    "agent-chrome-mcp": {
      "type": "streamable-http",
      "url": "http://127.0.0.1:12307/mcp"
    }
  }
}
```

## 🚀 安装和连接问题

### 快速诊断

如果遇到问题，运行诊断工具：

```bash
agent-chrome-mcp doctor
```

自动修复常见问题：

```bash
agent-chrome-mcp doctor --fix
```

### 点击扩展的连接按钮后如果没连接成功

1. **检查agent-chrome-mcp是否安装成功**，确保是全局安装的

```bash
agent-chrome-mcp -V
```

<img width="612" alt="截屏2025-06-11 15 09 57" src="https://github.com/user-attachments/assets/59458532-e6e1-457c-8c82-3756a5dbb28e" />

2. **检查清单文件是否已放在正确目录**

路径：C:\Users\xxx\AppData\Roaming\Google\Chrome\NativeMessagingHosts

3. **检查日志**

日志现在存储在用户目录：`%LOCALAPPDATA%\agent-chrome-mcp\logs\`

例如：`C:\Users\xxx\AppData\Local\agent-chrome-mcp\logs\`

<img width="804" alt="截屏2025-06-11 15 09 41" src="https://github.com/user-attachments/assets/ce7b7c94-7c84-409a-8210-c9317823aae1" />

4. **Node.js 路径问题**

如果使用 Node 版本管理器（nvm-windows、volta、fnm），可以设置环境变量：

```cmd
set CHROME_MCP_NODE_PATH=C:\path\to\your\node.exe
```

或者运行 `agent-chrome-mcp doctor --fix` 自动写入当前 Node 路径。
