# Claude Code 使用指南

<div align="center">
    <h1>🚀 Claude Code 镜像站使用教程</h1>
    <p>快速、准确、强大的 AI 编程助手</p>
    
    <a href="https://gaccode.cc/"><img src="https://img.shields.io/badge/Claude_Code-镜像站-blue?style=for-the-badge"></a>
    <a href="#安装教程"><img src="https://img.shields.io/badge/安装-教程-green?style=for-the-badge"></a>
    <a href="#使用方法"><img src="https://img.shields.io/badge/使用-方法-orange?style=for-the-badge"></a>
</div>

## 📖 项目简介

Claude Code 是一款革命性的 AI 编程助手，具有以下特点：

- **⚡ 快速响应** - 秒级生成代码和解决方案
- **🎯 精准理解** - 准确理解开发需求和意图
- **💪 强大功能** - 支持代码生成、重构、调试等多种场景
- **🌏 国内可用** - 通过镜像站无需魔法即可使用

## 🆚 对比优势

相比其他 AI 编程工具（如 Cursor、Gemini CLI），Claude Code 在以下方面表现突出：

- **响应速度更快** - 几十秒内完成复杂任务
- **理解能力更强** - 精准理解复杂代码库和重构需求
- **代码质量更高** - 生成的代码更加规范和可维护
- **体验更流畅** - 界面友好，操作简单

## 🔧 系统要求

在开始使用 Claude Code 之前，请确保您的系统满足以下要求：

- **操作系统**: macOS 10.15+ / Ubuntu 20.04+ / Debian 10+
- **Windows 用户**: 需要在 WSL (Windows Subsystem for Linux) 上部署
- **Node.js**: 18.0+ 版本

## 📝 安装教程

### 1. 注册账号

首先访问 Claude Code 镜像站并注册账号：

> **Claude Code 镜像站**: [https://gaccode.cc/](https://gaccode.cc/)

### 2. 安装 Node.js 环境

#### macOS 用户

```bash
# 使用 Homebrew 安装
brew install node

# 或使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Ubuntu/Debian 用户

```bash
# 安装 Node.js 22.x
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt-get install -y nodejs
```

#### 验证安装

```bash
node --version
npm --version
```

确保输出版本号为 18.0 或更高。

### 3. 安装 Claude Code

#### 卸载旧版本（如果存在）

```bash
npm uninstall -g @anthropic-ai/claude-code
```

#### 安装镜像版本

```bash
cd ~
npm install -g https://gaccodecode.com/claudecode/install --registry=https://registry.npmmirror.com
claude --version
```

## 🚀 使用方法

### 1. 创建项目目录

```bash
mkdir my-claude-project
cd my-claude-project
```

### 2. 启动 Claude Code

```bash
claude
```

### 3. 授权验证

首次运行时会跳转到浏览器进行授权：

1. 在浏览器中登录您的账号
2. 完成授权验证
3. 选择主题和配置选项
4. 允许 Claude Code 访问项目目录

## 💳 订阅激活

如果遇到需要订阅的提示，可以使用以下体验码：

```
MCE8JH4P-VDFOD0
MCE8JH4X-JN3F3S
MCE8JH53-93U6FC
```

**激活步骤**：
1. 访问 [Claude Code 镜像站](https://gaccode.cc/)
2. 进入 "管理订阅" 页面
3. 点击 "兑换优惠券"
4. 输入体验码完成激活

## 💡 使用技巧

### 代码生成
- 详细描述需求，Claude Code 会生成完整的代码实现
- 支持多种编程语言和框架

### 代码重构
- 提供现有代码，说明重构目标
- Claude Code 会保持文件名和变量一致性

### 调试助手
- 提供错误信息和代码片段
- 获得详细的调试建议和解决方案

## 🛠️ 常见问题

### Q: Windows 用户如何安装？
A: Windows 用户需要先安装 WSL，然后在 WSL 环境中按照 Linux 安装步骤进行。

### Q: 授权失败怎么办？
A: 确保网络连接正常，不要使用代理，重新运行 `claude` 命令。

### Q: 如何获取更多体验码？
A: 访问 [https://717ka.com/p/1xqz24eni937lycwlnq98ybz](https://717ka.com/p/1xqz24eni937lycwlnq98ybz) 获取最新体验码。

### Q: 远程服务器如何使用？
A: 复制命令行中的链接，在本地浏览器中打开并输入验证码。

## 📞 联系支持

如需企业合作或技术支持，请联系：

- **微信客服**: coder-maynor
- **QQ**: 1002569303
- **镜像站**: [https://gaccode.cc/](https://gaccode.cc/)

## 🎉 开始使用

恭喜您！现在可以开始使用 Claude Code 来提升您的编程效率了。

```bash
# 在项目目录中运行
claude
```

## 📄 许可证

本项目遵循 MIT 许可证。

---

<div align="center">
    <p>Made with ❤️ by Claude Code Community</p>
    <p>快速、准确、强大的 AI 编程助手</p>
</div>