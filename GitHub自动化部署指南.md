# 🚀 GitHub自动化部署指南

## 🎯 概述

通过GitHub Actions实现小红书AI话题的全自动采集，每天定时运行，无需本地电脑24小时开机。完全免费且稳定可靠！

## ⭐ GitHub方案优势

### 🆚 vs 本地Windows定时任务

| 特性 | GitHub Actions | 本地Windows任务 |
|------|---------------|----------------|
| **💰 费用** | 完全免费 | 电费成本 |
| **⚡ 稳定性** | 99.9%云端稳定 | 依赖本地电脑 |
| **🔧 维护** | 零维护 | 需要维护电脑 |
| **📊 监控** | 完整运行日志 | 需要手动检查 |
| **🌐 网络** | 全球CDN | 依赖本地网络 |
| **💾 存储** | 自动备份到仓库 | 本地存储 |

## 📋 部署步骤

### 第一步：准备GitHub仓库

#### 1.1 创建新仓库
1. 登录GitHub，点击右上角"+"
2. 选择"New repository"
3. 仓库名：`xiaohongshu-ai-scraper`
4. 设为**Private**（推荐，保护数据）
5. 勾选"Add a README file"
6. 点击"Create repository"

#### 1.2 上传代码
有两种方式上传代码到GitHub：

**方式A：通过GitHub网页界面**
1. 在仓库页面点击"uploading an existing file"
2. 将以下文件拖拽上传：
   - `xiaohongshu_auto_scraper.js`
   - `data_processor.js` 
   - `feishu_uploader.js`
   - `daily_ai_scraper.js`
   - `package.json`
   - 整个`.github`文件夹

**方式B：通过Git命令行**
```bash
# 克隆您的仓库
git clone https://github.com/your-username/xiaohongshu-ai-scraper.git
cd xiaohongshu-ai-scraper

# 复制所有文件到此目录
# 然后提交
git add .
git commit -m "🚀 初始化小红书AI话题采集系统"
git push origin main
```

### 第二步：配置GitHub Secrets

GitHub Secrets用于安全存储敏感信息，如API密钥等。

#### 2.1 访问Secrets设置
1. 进入您的GitHub仓库
2. 点击"Settings"选项卡
3. 左侧菜单选择"Secrets and variables" > "Actions"

#### 2.2 添加必要的Secrets
点击"New repository secret"，添加以下密钥：

| Secret名称 | 说明 | 是否必需 | 示例值 |
|-----------|------|---------|-------|
| `FEISHU_TABLE_URL` | 飞书多维表格URL | 可选 | `https://xxx.feishu.cn/base/xxx` |
| `FEISHU_APP_ID` | 飞书应用ID | 可选 | `cli_xxx` |
| `FEISHU_APP_SECRET` | 飞书应用密钥 | 可选 | `xxx` |

> **💡 提示：** 飞书相关密钥是可选的，因为目前主要通过生成CSV文件供手动上传。

### 第三步：启用GitHub Actions

#### 3.1 启用Actions
1. 在仓库中点击"Actions"选项卡
2. 如果看到"Get started with GitHub Actions"，点击"I understand my workflows, go ahead and enable them"

#### 3.2 查看工作流
1. 您应该能看到"📱 小红书AI话题每日采集"工作流
2. 点击进入查看详细配置

### 第四步：测试运行

#### 4.1 手动触发测试
1. 在"Actions"页面，选择"📱 小红书AI话题每日采集"工作流
2. 点击右侧"Run workflow"按钮
3. 选择运行模式：
   - **test** - 测试采集（推荐首次使用）
   - **run** - 完整运行
   - **upload** - 仅上传模式

#### 4.2 查看运行结果
1. 点击运行中的任务查看实时日志
2. 运行完成后查看"Artifacts"下载结果文件
3. 检查是否有错误信息

### 第五步：配置定时运行

#### 5.1 定时设置
工作流已预配置为每天北京时间上午9点自动运行：
```yaml
schedule:
  - cron: '0 1 * * *'  # UTC时间1点 = 北京时间9点
```

#### 5.2 修改运行时间（可选）
如需修改时间，编辑`.github/workflows/daily-ai-scraper.yml`：

| 北京时间 | Cron表达式 | 说明 |
|---------|-----------|------|
| 上午9点 | `0 1 * * *` | 默认时间 |
| 上午10点 | `0 2 * * *` | 推荐时间 |
| 下午2点 | `0 6 * * *` | 午后时间 |
| 晚上8点 | `0 12 * * *` | 晚间时间 |

## 📊 监控和管理

### 🔍 查看运行状态

#### 运行历史
1. 进入"Actions"页面
2. 查看所有历史运行记录
3. 绿色✅表示成功，红色❌表示失败

#### 下载运行结果
1. 点击任意一次运行
2. 在"Artifacts"部分下载：
   - `scraping-results-xxx` - 采集到的数据
   - `trend-analysis-xxx` - 趋势分析报告

### 📈 数据管理

#### 自动备份
- 重要数据会自动备份到`data-backup/`目录
- 每次成功运行后自动提交到仓库
- 保留完整的数据历史记录

#### 手动下载数据
1. 在仓库中查看`data-backup/`目录
2. 下载`master_topics.json`等数据文件
3. 或从Actions的Artifacts下载完整数据

### 📧 通知设置

#### 邮件通知（GitHub自带）
GitHub会在工作流失败时自动发送邮件通知。

#### 自定义通知（高级）
可以在工作流中添加：
- Slack通知
- 企业微信通知
- 钉钉通知
- 自定义Webhook

## 🛠️ 故障排除

### 常见问题

#### 1. 工作流运行失败
**可能原因：**
- 小红书网站结构变化
- 网络连接问题
- 代码逻辑错误

**解决方案：**
1. 查看失败的运行日志
2. 检查错误信息
3. 尝试手动运行测试模式

#### 2. 数据采集为空
**可能原因：**
- 小红书反爬虫机制
- 页面加载超时
- 选择器失效

**解决方案：**
1. 检查采集逻辑
2. 调整等待时间
3. 更新页面选择器

#### 3. GitHub Actions额度不够
**免费额度：**
- 公开仓库：无限制
- 私有仓库：每月2000分钟

**节省额度：**
- 优化运行时间
- 减少运行频率
- 使用公开仓库（如果不介意代码公开）

## 🎯 优化建议

### 性能优化
1. **减少运行时间**
   - 优化页面等待时间
   - 减少不必要的操作
   - 使用更高效的选择器

2. **提高成功率**
   - 增加重试机制
   - 改善错误处理
   - 添加备用数据源

### 功能扩展
1. **多平台支持**
   - 添加抖音话题采集
   - 支持微博热搜
   - 集成知乎热榜

2. **数据分析**
   - 生成趋势图表
   - 关键词词云
   - 热度预测模型

## 🔄 维护计划

### 每周检查
- [ ] 查看运行状态
- [ ] 检查数据质量
- [ ] 确认备份完整性

### 每月维护
- [ ] 更新依赖包
- [ ] 检查代码性能
- [ ] 清理旧数据

### 季度优化
- [ ] 分析采集效果
- [ ] 优化算法逻辑
- [ ] 添加新功能

## 💡 进阶技巧

### 多时段采集
可以添加多个定时任务：
```yaml
schedule:
  - cron: '0 1 * * *'   # 北京时间9点
  - cron: '0 9 * * *'   # 北京时间17点
```

### 条件运行
只在工作日运行：
```yaml
schedule:
  - cron: '0 1 * * 1-5'  # 周一到周五
```

### 环境分离
创建多个环境：
- `main`分支：生产环境
- `dev`分支：测试环境

## 📞 技术支持

### 常用命令
```bash
# 本地测试
npm test

# 本地运行
npm start

# 更新依赖
npm update
```

### 有用的链接
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Playwright文档](https://playwright.dev/)
- [Cron表达式生成器](https://crontab.guru/)

---

## 🎉 部署完成！

恭喜！您的小红书AI话题采集系统现在可以在GitHub上全自动运行了！

### 📈 接下来会发生什么？

1. **每天自动运行** - 无需任何人工干预
2. **数据自动采集** - 获取最新的AI话题
3. **结果自动保存** - 备份到GitHub仓库
4. **报告自动生成** - 可下载详细分析

### 🚀 享受自动化的便利！

从现在开始，您可以：
- ☕ 每天早上喝咖啡时查看最新AI话题
- 📊 随时下载数据进行深度分析  
- 🎯 专注于数据洞察而非数据采集
- 💰 完全免费享受云端自动化服务

**数据获取路径：** GitHub仓库 → Actions → 最新运行 → Artifacts → 下载数据文件

---
*最后更新：2025年1月 | 作者：AI Assistant* 