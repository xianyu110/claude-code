# Claude Code 完全使用指南：三种方式解锁最强AI编程助手

<div align="center">

# 🚀 Claude Code 完全使用指南

**3行环境变量解锁百款顶级AI模型 + 镜像站直连 + 官方合租方案**

[![Claude Code](https://img.shields.io/badge/Claude_Code-完全指南-blue?style=for-the-badge)](https://gaccode.cc/)
[![自定义API](https://img.shields.io/badge/自定义-API-green?style=for-the-badge)](#方式一自定义api接入)
[![镜像站](https://img.shields.io/badge/镜像站-直连-orange?style=for-the-badge)](#方式二镜像站使用)
[![合租方案](https://img.shields.io/badge/合租-方案-red?style=for-the-badge)](#方式三官方合租方案)

</div>

## 📞 联系支持

- **微信客服**: coder-maynor
- **QQ**: 1002569303
- **网站**：https://vlink.cc/maynorai

## 📖 项目简介

Claude Code 是一款革命性的 AI 编程助手，相比其他 AI 编程工具（如 Cursor、Gemini CLI），具有以下优势：

### 🏆 核心优势

- **⚡ 响应速度极快** - 几十秒内完成复杂任务
- **🎯 理解能力超强** - 精准理解复杂代码库和重构需求  
- **💪 代码质量更高** - 生成的代码更加规范和可维护
- **🌏 国内完美支持** - 三种方式突破网络限制

### 💡 使用场景对比

| **使用场景** | **官方限制** | **本指南解决方案** |
|-------------|--------------|-------------------|
| **模型选择** | 只能用Claude | 支持GPT-4.1、Gemini、Grok等百款模型 |
| **网络要求** | 需要国外网络 | 国内直连，速度飞快 |
| **成本控制** | Claude价格昂贵 | 成本降低50%以上 |

![Claude Code 模型接入示意图](https://restname.oss-cn-hangzhou.aliyuncs.com/image-20250804114706282.png)

---

## 🛠️ 三种使用方式

本指南提供三种使用Claude Code的方式，您可以根据需求选择：

1. **自定义API接入** - 通过环境变量接入第三方模型（更灵活）
2. **镜像站直连** - 通过国内镜像站使用（更简单）
3. **官方合租方案** - 多人共享正版账号（最经济）

---

## 📋 方式一：自定义API接入

通过3行环境变量，让Claude Code支持OpenAI、Gemini、Grok等百款顶级模型。

### 🔧 安装步骤

#### 1. 系统要求

- 💻 系统：Mac / Linux / Windows (WSL)
- 🔧 软件：Node.js 18+
- 🔑 API密钥：https://apipro.maynor1024.live

#### 2. 安装Node.js

**macOS用户：**
```bash
# 使用Homebrew
brew install node

# 或使用nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 18
nvm use 18
```

**Linux用户：**
```bash
# Ubuntu/Debian
sudo apt update
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs
```

#### 3. 安装Claude Code

```bash
# 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

#### 4. 配置自定义API

```bash
# 设置环境变量（3行搞定）
export ANTHROPIC_BASE_URL=https://apipro.maynor1024.live
export ANTHROPIC_AUTH_TOKEN=sk-xxx  # 替换成你的API密钥

# 启动Claude Code（可指定任意模型）
claude --model gpt-4.1-mini
```

> 🎯 **关键提醒**：首次运行时会出现选择界面，必须选择第2选项：**Anthropic Console account**，否则无法自定义API模型。

![Claude Code 安装界面](https://restname.oss-cn-hangzhou.aliyuncs.com/image-20250804115641241.png)

**支持的模型包括：**
- 🤖 GPT-4.1 / GPT-4.1-mini
- 💎 Gemini-2.5-Pro
- ⚡ Grok-4
- 🧠 O3
- 🌟 DeepSeek等百款模型

**启动成功界面：**

![Claude Code 启动界面](https://restname.oss-cn-hangzhou.aliyuncs.com/image-20250804120151029.png)

执行成功后，会出现此界面，**直接按回车键即可**。

### 📊 使用效果

实测数据对比：
- ⚡ **响应速度提升35%**
- 💰 **成本降低50%以上**
- ✅ **接口100%兼容**
- 🎯 **模型任意切换**

---

## 📋 方式二：镜像站使用

通过国内镜像站，无需配置即可直接使用。

### 🔧 安装步骤

#### 1. 注册账号

访问Claude Code镜像站：[https://gaccode.cc/](https://gaccode.cc/)

#### 2. 安装镜像版本

```bash
# 卸载旧版本（如果存在）
npm uninstall -g @anthropic-ai/claude-code

# 安装镜像版本
cd ~
npm install -g https://gaccodecode.com/claudecode/install --registry=https://registry.npmmirror.com

# 验证安装
claude --version
```

#### 3. 启动使用

```bash
# 创建项目目录
mkdir my-project
cd my-project

# 启动Claude Code
claude
```

#### 4. 激活订阅

如需激活，可使用以下体验码：
```
MCE8JH4P-VDFOD0
MCE8JH4X-JN3F3S
MCE8JH53-93U6FC
```

---

## 📋 方式三：官方合租方案

多人共享正版Claude Code账号，成本最低的使用方案。

### 💰 合租优势

- **💸 超低成本** - 仅需¥388，相比官方价格节省75%以上
- **👥 4人共享** - 与其他3人共享账号，互不影响
- **🔧 专业服务** - 提供远程安装指导和使用教程
- **✅ 正版保障** - 官方正版账号，稳定不封

### 📦 服务内容

**基础套餐（¥388）包含：**
1. **Claude Code正版账号共享**
   - Opus模型完全可用
   - Sonnet模型几乎无限使用
   - 支持所有官方功能

2. **技术支持服务**
   - 远程指导安装配置
   - 提供详细使用教程
   - 解决使用中的问题

3. **账号保障**
   - 稳定不封保证
   - 自建服务器部署
   - 4人小组使用，避免滥用

### 🚀 申请流程

1. **联系客服**
   - 添加微信：coder-maynor
   - 说明需要Claude Code合租服务

2. **支付费用**
   - 一次性支付¥388
   - 支持微信/支付宝

3. **等待开通**
   - 预计1-2小时内完成
   - 客服会远程协助安装

### ⚠️ 注意事项

- 合租账号仅限4人使用，请勿外传
- 请合理使用，避免过度消耗
- 如有违规使用，可能影响整组用户

---

## 💡 使用技巧

### 🎯 最佳实践

1. **代码生成**
   - 详细描述需求，包含上下文
   - 指定编程语言和框架
   - 提供示例代码参考

2. **代码重构**
   - 提供完整的原始代码
   - 明确说明重构目标
   - 保持文件和变量命名一致性

3. **调试助手**
   - 提供完整的错误信息
   - 包含相关代码片段
   - 说明预期行为

### 🚀 高级技巧

1. **模型选择**（自定义API方式）
   ```bash
   # 使用不同模型
   claude --model gpt-4.1          # 最强推理
   claude --model gemini-2.5-pro   # 平衡选择
   claude --model grok-4           # 快速响应
   ```

2. **项目配置**
   ```bash
   # 在项目根目录创建 .claude 配置文件
   echo "model=gpt-4.1" > .claude
   ```

---

## 🛠️ 常见问题

### Q: Windows用户如何安装？
A: Windows用户需要先安装WSL，然后在WSL环境中按照Linux步骤进行。

### Q: 如何选择使用方式？
A: 
- 需要灵活切换模型 → 选择自定义API方式
- 追求简单易用 → 选择镜像站方式
- 预算有限 → 选择官方合租方案

### Q: 授权失败怎么办？
A: 
1. 确保网络连接正常
2. 不要使用代理
3. 重新运行`claude`命令

### Q: 如何降低使用成本？
A: 
1. 使用自定义API方式，选择性价比更高的模型如gpt-4.1-mini
2. 选择官方合租方案，仅需¥388即可长期使用

---

## 📡 技术原理

### 自定义API原理

```
Claude Code → API代理层 → 目标模型 → 响应转换 → Claude Code
```

通过中间层转换，实现Claude协议与其他模型协议的完美兼容。

### 镜像站原理

通过国内CDN加速和智能路由，实现低延迟高可用的服务。

---

## 📞 联系支持

- **微信客服**: coder-maynor
- **QQ**: 1002569303
- **API获取**: https://apipro.maynor1024.live
- **镜像站**: https://gaccode.cc/

---

## 🎉 总结

通过本指南的三种方式，您可以：

✅ **突破网络限制** - 国内直连使用  
✅ **降低使用成本** - 成本减少50%以上  
✅ **提升开发效率** - 多模型随意切换  
✅ **获得最佳体验** - 速度快、效果好

选择最适合您的方式，立即开始使用Claude Code，让AI成为您的编程超级助手！

---

<div align="center">
    <p>🚀 让我们一起在AI时代乘风破浪！</p>
    <p>Made with ❤️ by Claude Code Community</p>
</div>