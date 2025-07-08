# 🤖 小红书AI话题自动采集系统

> 基于Playwright的智能化小红书AI话题采集工具，支持本地定时任务和GitHub Actions云端自动化运行

[![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

## ✨ 功能特点

🚀 **全自动化采集** - 智能获取小红书AI相关热门话题  
📊 **数据去重处理** - 自动识别和更新重复内容  
☁️ **云端运行支持** - GitHub Actions免费云端执行  
📈 **飞书集成** - 直接上传数据到飞书多维表格  
📋 **详细报告** - 自动生成每日数据分析报告  
🔔 **智能通知** - 支持多种通知方式  

## 🎯 适用场景

- 🔍 **AI从业者** - 跟踪行业热点和趋势
- 📝 **内容创作者** - 发现热门话题和创作灵感  
- 📊 **数据分析师** - 收集社交媒体数据进行分析
- 🚀 **创业者** - 洞察市场需求和用户关注点

## 🚀 快速开始

### 方案选择

| 方案 | 优势 | 适用场景 |
|------|------|---------|
| 🌐 **GitHub Actions** | 免费、稳定、零维护 | 推荐给所有用户 |
| 💻 **本地运行** | 完全控制、即时调试 | 技术用户、定制需求 |

### ⚡ GitHub云端部署（推荐）

1. **Fork本仓库**到您的GitHub账号
2. **配置Secrets**（可选）
3. **启用Actions**并运行测试
4. **享受每日自动采集**

> 📖 详细步骤请查看：[GitHub自动化部署指南.md](./GitHub自动化部署指南.md)

### 💻 本地部署

```bash
# 1. 克隆仓库
git clone https://github.com/your-username/xiaohongshu-ai-scraper.git
cd xiaohongshu-ai-scraper

# 2. 安装依赖
npm install
npx playwright install chromium

# 3. 测试运行
npm run test

# 4. 配置飞书
npm run setup

# 5. 正式运行
npm start
```

> 📖 详细步骤请查看：[Windows定时任务设置指南.md](./Windows定时任务设置指南.md)

## 📁 项目结构

```
xiaohongshu-ai-scraper/
├── 📄 xiaohongshu_auto_scraper.js     # 小红书数据采集引擎
├── 🔄 data_processor.js              # 数据处理和去重模块
├── 📤 feishu_uploader.js             # 飞书自动上传模块
├── 🎯 daily_ai_scraper.js            # 主调度程序
├── 📦 package.json                   # 项目配置和依赖
├── 🔧 config.example.env             # 环境变量配置示例
├── 🖥️ run_daily_scraper.bat         # Windows批处理脚本
├── 📊 .github/workflows/             # GitHub Actions工作流
│   └── daily-ai-scraper.yml
├── 📋 data/                          # 数据存储目录（自动创建）
│   ├── master_topics.json           # 主数据库
│   ├── daily_scraper.log           # 运行日志
│   └── daily_report_*.md           # 每日报告
└── 📚 docs/                         # 文档目录
    ├── GitHub自动化部署指南.md
    └── Windows定时任务设置指南.md
```

## 🔧 配置选项

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `HEADLESS` | 无头模式运行 | `false` |
| `GITHUB_ACTIONS` | GitHub Actions环境 | 自动检测 |
| `FEISHU_TABLE_URL` | 飞书表格URL | - |

### 运行模式

```bash
# 测试模式（不上传到飞书）
node daily_ai_scraper.js test

# 正常运行（完整流程）
node daily_ai_scraper.js run

# 仅上传模式
node daily_ai_scraper.js upload

# 飞书配置向导
node daily_ai_scraper.js setup
```

## 📊 数据输出

### 📈 采集数据格式

```json
{
  "title": "AI工具推荐合集",
  "author": "AI知识库",
  "likes": 7922,
  "category": "AI工具",
  "heat_level": "高热度",
  "scraped_time": "2025-01-07",
  "source": "小红书"
}
```

### 📋 输出文件

- `📊 feishu_export_YYYY-MM-DD.csv` - 飞书导入格式
- `📄 daily_report_YYYY-MM-DD.md` - 每日分析报告
- `🗄️ master_topics.json` - 完整数据库
- `📝 daily_scraper.log` - 运行日志

## 🔍 监控和维护

### GitHub Actions

- ✅ **运行状态**：Actions页面查看历史记录
- 📥 **下载数据**：Artifacts部分获取结果文件
- 🔔 **失败通知**：自动邮件提醒

### 本地运行

- 📋 **查看日志**：`./data/daily_scraper.log`
- 📊 **数据统计**：每日报告自动生成
- 🔧 **手动调试**：测试模式验证功能

## 🛠️ 故障排除

### 常见问题

<details>
<summary>🔸 采集到的数据为空</summary>

**可能原因：**
- 小红书页面结构变化
- 网络连接问题
- 反爬虫机制

**解决方案：**
1. 运行测试模式：`npm run test`
2. 检查网络连接
3. 查看错误日志：`./data/daily_scraper.log`
</details>

<details>
<summary>🔸 飞书上传失败</summary>

**可能原因：**
- 未配置飞书连接
- 登录状态过期
- 表格权限不足

**解决方案：**
1. 重新运行设置：`npm run setup`
2. 检查飞书登录状态
3. 确认表格访问权限
</details>

<details>
<summary>🔸 GitHub Actions运行失败</summary>

**可能原因：**
- 代码语法错误
- 依赖安装失败
- 运行时间超时

**解决方案：**
1. 查看Actions运行日志
2. 检查代码更改
3. 重新触发运行
</details>

## 🎯 发展规划

### 🚀 即将推出

- [ ] 🎨 Web可视化界面
- [ ] 📱 支持更多社交平台
- [ ] 🤖 AI内容分析和预测
- [ ] 📧 邮件/微信自动通知
- [ ] 📈 数据可视化图表

### 💡 长期规划

- [ ] 🌍 多语言支持
- [ ] ☁️ 云端数据库集成
- [ ] 🔗 API接口开放
- [ ] 📚 插件生态系统

## 🤝 贡献指南

欢迎贡献代码和建议！

1. Fork本仓库
2. 创建功能分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'Add amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 提交Pull Request

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## ⭐ 支持项目

如果这个项目对您有帮助，请考虑：

- 🌟 **Star本仓库**
- 🐛 **报告Bug**
- 💡 **提出建议**
- 🔗 **分享给朋友**

## 📞 联系我们

- 📧 Issues：[GitHub Issues](https://github.com/your-username/xiaohongshu-ai-scraper/issues)
- 💬 讨论：[GitHub Discussions](https://github.com/your-username/xiaohongshu-ai-scraper/discussions)

---

<div align="center">

**🚀 立即开始您的AI话题采集之旅！**

[快速部署](#-快速开始) • [查看文档](./GitHub自动化部署指南.md) • [报告问题](https://github.com/your-username/xiaohongshu-ai-scraper/issues)

</div>