# Agent Chrome MCP 🚀

[![许可证: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![Chrome 扩展](https://img.shields.io/badge/Chrome-Extension-green.svg)](https://developer.chrome.com/docs/extensions/)

> 🌟 **把你的 Chrome 浏览器变成 Agent 驱动的工作自动化工具** - 让 AI 操作你自己的浏览器，用于资料调研、运营后台、QA 检查、表单录入、内容工作流以及编码相关任务。

**📖 文档**: [English](README.md) | [中文](README_zh.md)

> 项目仍处于早期阶段，正在紧锣密鼓开发中，后续将有更多新功能，以及稳定性等的提升，如遇bug，请轻喷

---

## 🎯 什么是 Agent Chrome MCP？

Agent Chrome MCP 是一个基于 Chrome 插件的 **模型上下文协议 (MCP) 服务器**，它把你自己的 Chrome 浏览器暴露给 AI Agent。它不只面向编码场景，也面向日常浏览器工作自动化：资料调研、表单录入、运营后台、QA 检查、内容工作流、购物/旅行流程，以及编码相关任务。

与传统的浏览器自动化工具（如 Playwright）不同，**Agent Chrome MCP** 直接使用你日常使用的 Chrome 浏览器，保留已有标签页、登录态、cookies、扩展和设置。任何支持 MCP 的 Agent 都可以操作你已经在用的浏览器，而不是另开一个自动化浏览器。

## 🤝 兼容热门 Agent

Agent Chrome MCP 可接入任意支持 MCP 的 Agent，无需绑定特定厂商。安装 Chrome 扩展后，**让 Agent 帮你安装**即可。

### Cowork Agent

- [Claude Cowork](https://claude.com/product/cowork)
- [ChatGPT](https://chatgpt.com)
- [QoderWork](https://qoder.com/qoderwork)

### 编码及其他 Agent

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [OpenAI Codex](https://developers.openai.com/codex)
- [Cursor](https://cursor.com)
- [Cherry Studio](https://cherry-ai.com)
- [Augment](https://augmentcode.com)

### 让 Agent 帮你安装

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

重启 Agent 后，打开扩展弹窗并点击**连接**。扩展安装步骤见[快速开始](#-快速开始)。

## ✨ 船新的功能(2025/12/30)

- **让Claude Code/Codex也能使用的可视化编辑器**, 更多详情请看: [VisualEditor](docs/VisualEditor_zh.md)

## ✨ 核心特性

- 😁 **Agent/模型无关**：适用于任意支持 MCP 的 Agent 或 LLM 客户端
- 🧩 **工作自动化**：自动化资料调研、表单填写、后台操作、QA 检查、内容任务和编码工作流
- ⭐️ **使用你原本的浏览器**：保留已有标签页、登录态、cookies、扩展和设置
- 💻 **完全本地运行**：纯本地 MCP server，保证用户隐私
- 🚄 **Streamable HTTP**：Streamable HTTP 连接方式
- 🏎 **跨标签页**：跨标签页上下文
- 🧠 **语义搜索**：内置向量数据库，智能发现浏览器标签页内容
- 🔍 **智能内容分析**：AI 驱动的文本提取和相似度匹配
- 🌐 **20+ 工具**：截图、网络监控、交互操作、书签、历史记录等
- 🚀 **SIMD 加速 AI**：自定义 WebAssembly SIMD 优化，向量运算速度提升 4-8 倍

查看维护中的功能列表：[docs/FEATURES_zh.md](docs/FEATURES_zh.md)

## 🆚 与同类项目对比

| 对比维度           | 基于Playwright的MCP Server                                          | 基于Chrome插件的MCP Server                                    |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------- |
| **资源占用**       | ❌ 需启动独立浏览器进程，需要安装Playwright依赖，下载浏览器二进制等 | ✅ 无需启动独立的浏览器进程，直接利用用户已打开的Chrome浏览器 |
| **用户会话复用**   | ❌ 需重新登录                                                       | ✅ 自动使用已登录状态                                         |
| **浏览器环境保持** | ❌ 干净环境缺少用户设置                                             | ✅ 完整保留用户环境                                           |
| **API访问权限**    | ⚠️ 受限于Playwright API                                             | ✅ Chrome原生API全访问                                        |
| **启动速度**       | ❌ 需启动浏览器进程                                                 | ✅ 只需激活插件                                               |
| **响应速度**       | 50-200ms进程间通信                                                  | ✅ 更快                                                       |

## 🚀 快速开始

无需全局 npm 安装。安装 Chrome 扩展后，用下方可复制提示词让 Agent 帮你添加 MCP 配置即可。

### 环境要求

- Chrome/Chromium 浏览器
- 支持 MCP 的 Cowork Agent，例如 Claude Cowork、Claude Code、Codex、Cursor、QoderWork 或 ChatGPT

推荐配置使用 `npx` 自动启动桥接服务，用户不需要手动运行 `npm install -g`。

### 安装步骤

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

重启 Agent。然后打开插件弹窗并点击"连接"。

#### 手动 MCP 配置

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

然后重启 Agent，并在插件弹窗里点击"连接"。

### 在支持MCP协议的客户端中使用

#### 使用 stdio 方式连接（推荐）

将以下配置添加到客户端的 MCP 配置中。Agent 会自动通过 npx 启动桥接服务，不需要用户手动全局安装。

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

如果你偏好全局安装，也可以运行 `npm install -g agent-chrome-mcp`，然后使用：

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

HTTP 方式只作为高级用法：扩展启动本地桥接后，端点是 `http://127.0.0.1:12307/mcp`。

<img width="494" alt="截屏2025-06-22 22 11 25" src="https://github.com/user-attachments/assets/07c0b090-622b-433d-be70-44e8cb8980a5" />

## 🛠️ 可用工具

完整工具列表：[完整工具列表](docs/TOOLS_zh.md)

<details>
<summary><strong>📊 浏览器管理 (6个工具)</strong></summary>

- `get_windows_and_tabs` - 列出所有浏览器窗口和标签页
- `chrome_navigate` - 导航到 URL 并控制视口
- `chrome_switch_tab` - 切换当前显示的标签页
- `chrome_close_tabs` - 关闭特定标签页或窗口
- `chrome_go_back_or_forward` - 浏览器导航控制
- `chrome_inject_script` - 向网页注入内容脚本
- `chrome_send_command_to_inject_script` - 向已注入的内容脚本发送指令
</details>

<details>
<summary><strong>📸 截图和视觉 (1个工具)</strong></summary>

- `chrome_screenshot` - 高级截图捕获，支持元素定位、全页面和自定义尺寸
</details>

<details>
<summary><strong>🌐 网络监控 (4个工具)</strong></summary>

- `chrome_network_capture_start/stop` - webRequest API 网络捕获
- `chrome_network_debugger_start/stop` - Debugger API 包含响应体
- `chrome_network_request` - 发送自定义 HTTP 请求
</details>

<details>
<summary><strong>🔍 内容分析 (4个工具)</strong></summary>

- `search_tabs_content` - AI 驱动的浏览器标签页语义搜索
- `chrome_get_web_content` - 从页面提取 HTML/文本内容
- `chrome_get_interactive_elements` - 查找可点击元素
- `chrome_console` - 捕获和获取浏览器标签页的控制台输出
</details>

<details>
<summary><strong>🎯 交互操作 (3个工具)</strong></summary>

- `chrome_click_element` - 使用 CSS 选择器点击元素
- `chrome_fill_or_select` - 填充表单和选择选项
- `chrome_keyboard` - 模拟键盘输入和快捷键
</details>

<details>
<summary><strong>📚 数据管理 (5个工具)</strong></summary>

- `chrome_history` - 搜索浏览器历史记录，支持时间过滤
- `chrome_bookmark_search` - 按关键词查找书签
- `chrome_bookmark_add` - 添加新书签，支持文件夹
- `chrome_bookmark_delete` - 删除书签
</details>

## 🧪 使用示例

### ai帮你总结网页内容然后自动控制excalidraw画图

prompt: [excalidraw-prompt](prompt/excalidraw-prompt.md)
指令：帮我总结当前页面内容，然后画个图帮我理解
https://www.youtube.com/watch?v=3fBPdUBWVz0

https://github.com/user-attachments/assets/f14f79a6-9390-4821-8296-06d020bcfc07

### ai先分析图片的内容元素，然后再自动控制excalidraw把图片模仿出来

prompt: [excalidraw-prompt](prompt/excalidraw-prompt.md)|[content-analize](prompt/content-analize.md)
指令：先看下图片是否能用excalidraw画出来，如果则列出所需的步骤和元素，然后画出来
https://www.youtube.com/watch?v=tEPdHZBzbZk

https://github.com/user-attachments/assets/4f0600c1-bb1e-4b57-85ab-36c8bdf71c68

### ai自动帮你注入脚本并修改网页的样式

prompt: [modify-web-prompt](prompt/modify-web.md)
指令：帮我修改当前页面的样式，去掉广告
https://youtu.be/twI6apRKHsk

https://github.com/user-attachments/assets/aedbe98d-e90c-4a58-a4a5-d888f7293d8e

### ai自动帮你捕获网络请求

指令：我想知道小红书的搜索接口是哪个，响应体结构是什么样的
https://youtu.be/1hHKr7XKqnQ

https://github.com/user-attachments/assets/dc7e5cab-b9af-4b9a-97ce-18e4837318d9

### ai帮你分析你的浏览记录

指令：分析一下我近一个月的浏览记录
https://youtu.be/jf2UZfrR2Vk

https://github.com/user-attachments/assets/31b2e064-88c6-4adb-96d7-50748b826eae

### 网页对话

指令：翻译并总结当前网页
https://youtu.be/FlJKS9UQyC8

https://github.com/user-attachments/assets/aa8ef2a1-2310-47e6-897a-769d85489396

### ai帮你自动截图（网页截图）

指令：把huggingface的首页截个图
https://youtu.be/7ycK6iksWi4

https://github.com/user-attachments/assets/65c6eee2-6366-493d-a3bd-2b27529ff5b3

### ai帮你自动截图（元素截图）

指令：把huggingface首页的图标截取下来
https://youtu.be/ev8VivANIrk

https://github.com/user-attachments/assets/d0cf9785-c2fe-4729-a3c5-7f2b8b96fe0c

### ai帮你管理书签

指令：将当前页面添加到书签中，放到合适的文件夹
https://youtu.be/R_83arKmFTo

https://github.com/user-attachments/assets/15a7d04c-0196-4b40-84c2-bafb5c26dfe0

### 自动关闭网页

指令：关闭所有shadcn相关的网页
https://youtu.be/2wzUT6eNVg4

https://github.com/user-attachments/assets/83de4008-bb7e-494d-9b0f-98325cfea592

## 🤝 贡献指南

我们欢迎贡献！请查看 [CONTRIBUTING_zh.md](docs/CONTRIBUTING_zh.md) 了解详细指南。

## 🚧 未来发展路线图

我们对 Agent Chrome MCP 的未来发展有着激动人心的计划：

- [ ] 身份认证

- [ ] 录制与回放

- [ ] 工作流自动化

- [ ] 增强浏览器支持（Firefox 扩展）

---

**想要为这些功能中的任何一个做贡献？** 查看我们的[贡献指南](docs/CONTRIBUTING_zh.md)并加入我们的开发社区！

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

特别感谢原始项目 [hangwin/mcp-chrome](https://github.com/hangwin/mcp-chrome) 及其作者 **hangye**。本项目是在其工作的基础上继续演进而来。

## 📚 更多文档

完整文档索引：[docs/README_zh.md](docs/README_zh.md)

- [架构设计](docs/ARCHITECTURE_zh.md) - 详细的技术架构说明
- [功能列表](docs/FEATURES_zh.md) - 当前功能面维护列表
- [工具列表](docs/TOOLS_zh.md) - 完整的工具 API 文档
- [故障排除](docs/TROUBLESHOOTING_zh.md) - 常见问题解决方案
- [Windows 安装指南](docs/WINDOWS_INSTALL_zh.md) - Windows 平台安装说明
- [CLI MCP 配置](docs/mcp-cli-config_zh.md) - Codex / Claude Code 连接说明
- [更新日志](docs/CHANGELOG_zh.md) - 版本变更记录
- [可视化编辑器](docs/VisualEditor_zh.md) - Claude Code / Codex 可视化编辑

## 微信交流群

拉群的目的是让踩过坑的大佬们互相帮忙解答问题，因本人平时要忙着搬砖，不一定能及时解答

![IMG_6296](https://github.com/user-attachments/assets/ecd2e084-24d2-4038-b75f-3ab020b55594)
