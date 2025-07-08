#!/bin/bash

# 🚀 小红书AI话题采集系统 - GitHub快速部署脚本
# 作者：AI Assistant
# 日期：2025年1月

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 打印彩色文本
print_color() {
    printf "${1}${2}${NC}\n"
}

print_header() {
    echo
    print_color $CYAN "======================================"
    print_color $CYAN "  🤖 小红书AI话题采集系统"
    print_color $CYAN "  GitHub Actions 快速部署向导"
    print_color $CYAN "======================================"
    echo
}

print_step() {
    print_color $BLUE "📋 $1"
}

print_success() {
    print_color $GREEN "✅ $1"
}

print_warning() {
    print_color $YELLOW "⚠️  $1"
}

print_error() {
    print_color $RED "❌ $1"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查必要工具
check_prerequisites() {
    print_step "检查必要工具..."
    
    local missing_tools=()
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if ! command_exists node; then
        missing_tools+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing_tools+=("npm")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "缺少必要工具：${missing_tools[*]}"
        print_warning "请安装这些工具后重新运行脚本"
        exit 1
    fi
    
    print_success "所有必要工具已安装"
}

# 检查GitHub配置
check_github_config() {
    print_step "检查GitHub配置..."
    
    if ! git config user.name >/dev/null 2>&1; then
        print_warning "未配置Git用户名"
        read -p "请输入您的GitHub用户名: " github_username
        git config --global user.name "$github_username"
    fi
    
    if ! git config user.email >/dev/null 2>&1; then
        print_warning "未配置Git邮箱"
        read -p "请输入您的GitHub邮箱: " github_email
        git config --global user.email "$github_email"
    fi
    
    print_success "GitHub配置完成"
}

# 创建新仓库
create_repository() {
    print_step "准备创建GitHub仓库..."
    
    echo
    print_color $YELLOW "请按照以下步骤创建GitHub仓库："
    echo "1. 访问：https://github.com/new"
    echo "2. 仓库名：xiaohongshu-ai-scraper"
    echo "3. 描述：小红书AI话题自动采集系统"
    echo "4. 设为Private（推荐）"
    echo "5. 勾选'Add a README file'"
    echo "6. 点击'Create repository'"
    echo
    
    read -p "创建完成后，请输入您的GitHub用户名: " github_username
    read -p "请确认仓库名（默认：xiaohongshu-ai-scraper）: " repo_name
    repo_name=${repo_name:-xiaohongshu-ai-scraper}
    
    REPO_URL="https://github.com/$github_username/$repo_name.git"
    
    print_success "仓库信息已设置：$REPO_URL"
}

# 初始化本地仓库
init_local_repo() {
    print_step "初始化本地仓库..."
    
    if [ -d ".git" ]; then
        print_warning "检测到现有Git仓库，将重新初始化"
        rm -rf .git
    fi
    
    git init
    git remote add origin "$REPO_URL"
    
    print_success "本地仓库初始化完成"
}

# 安装依赖
install_dependencies() {
    print_step "安装项目依赖..."
    
    if [ ! -f "package.json" ]; then
        print_error "未找到package.json文件"
        exit 1
    fi
    
    npm install
    
    print_step "安装Playwright浏览器..."
    npx playwright install chromium
    
    print_success "依赖安装完成"
}

# 测试本地运行
test_local() {
    print_step "测试本地运行..."
    
    print_color $YELLOW "正在运行测试模式..."
    
    if node daily_ai_scraper.js test; then
        print_success "本地测试运行成功"
    else
        print_warning "本地测试运行失败，但不影响GitHub部署"
        print_warning "可能原因：网络问题或小红书反爬虫机制"
    fi
}

# 提交代码到GitHub
push_to_github() {
    print_step "推送代码到GitHub..."
    
    # 创建.gitignore文件
    cat > .gitignore << EOF
# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 运行时文件
data/
*.log

# 环境配置
.env
config.local.env

# IDE
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db

# 临时文件
*.tmp
*.temp
EOF
    
    git add .
    git commit -m "🚀 初始化小红书AI话题采集系统

- ✨ 添加自动化采集脚本
- 🔧 配置GitHub Actions工作流
- 📊 集成飞书数据上传功能
- 📋 完善文档和使用指南"
    
    git branch -M main
    
    print_color $YELLOW "正在推送到GitHub..."
    git push -u origin main
    
    print_success "代码已推送到GitHub"
}

# 配置GitHub Secrets
configure_secrets() {
    print_step "配置GitHub Secrets..."
    
    echo
    print_color $YELLOW "请在GitHub仓库中配置以下Secrets（可选）："
    echo
    print_color $CYAN "1. 访问：https://github.com/$github_username/$repo_name/settings/secrets/actions"
    echo "2. 点击'New repository secret'"
    echo "3. 添加以下密钥（如果需要）："
    echo
    printf "   %-20s %s\n" "FEISHU_TABLE_URL" "您的飞书多维表格URL"
    printf "   %-20s %s\n" "FEISHU_APP_ID" "飞书应用ID（如使用API）"
    printf "   %-20s %s\n" "FEISHU_APP_SECRET" "飞书应用密钥（如使用API）"
    echo
    print_color $YELLOW "💡 提示：这些Secrets是可选的，系统会生成CSV文件供手动上传"
    echo
    
    read -p "配置完成后按回车继续..."
    
    print_success "Secrets配置指引已提供"
}

# 启用GitHub Actions
enable_actions() {
    print_step "启用GitHub Actions..."
    
    echo
    print_color $YELLOW "请按照以下步骤启用GitHub Actions："
    echo
    print_color $CYAN "1. 访问：https://github.com/$github_username/$repo_name/actions"
    echo "2. 如果看到提示，点击'I understand my workflows, go ahead and enable them'"
    echo "3. 您应该能看到'📱 小红书AI话题每日采集'工作流"
    echo "4. 点击该工作流进入详情页面"
    echo
    
    read -p "启用完成后按回车继续..."
    
    print_success "GitHub Actions启用指引已提供"
}

# 运行测试
run_github_test() {
    print_step "运行GitHub Actions测试..."
    
    echo
    print_color $YELLOW "请手动触发GitHub Actions测试："
    echo
    print_color $CYAN "1. 在工作流页面点击'Run workflow'按钮"
    echo "2. 选择运行模式：'test'（推荐）"
    echo "3. 点击绿色的'Run workflow'按钮"
    echo "4. 等待运行完成并查看结果"
    echo
    print_color $YELLOW "运行完成后，您可以在'Artifacts'部分下载结果文件"
    echo
    
    read -p "测试完成后按回车继续..."
    
    print_success "GitHub Actions测试指引已提供"
}

# 部署总结
deployment_summary() {
    print_color $GREEN "🎉 GitHub部署完成！"
    echo
    print_color $CYAN "📋 部署总结："
    echo "   仓库地址：https://github.com/$github_username/$repo_name"
    echo "   Actions页面：https://github.com/$github_username/$repo_name/actions"
    echo "   设置页面：https://github.com/$github_username/$repo_name/settings"
    echo
    print_color $YELLOW "🔄 自动运行设置："
    echo "   ⏰ 每天北京时间上午9点自动运行"
    echo "   📊 结果文件可在Actions页面下载"
    echo "   📧 失败时GitHub会自动发送邮件通知"
    echo
    print_color $BLUE "📈 下一步操作："
    echo "   1. ⭐ Star您的仓库（可选）"
    echo "   2. 📋 查看每日运行结果"
    echo "   3. 📊 下载数据文件进行分析"
    echo "   4. 🔧 根据需要调整运行时间"
    echo
    print_color $PURPLE "🎯 数据获取路径："
    echo "   GitHub仓库 → Actions → 最新运行 → Artifacts → 下载数据文件"
    echo
    print_success "享受全自动的AI话题采集服务！"
}

# 主函数
main() {
    print_header
    
    # 检查当前目录是否包含项目文件
    if [ ! -f "daily_ai_scraper.js" ]; then
        print_error "请在项目根目录运行此脚本"
        exit 1
    fi
    
    check_prerequisites
    check_github_config
    create_repository
    init_local_repo
    install_dependencies
    test_local
    push_to_github
    configure_secrets
    enable_actions
    run_github_test
    deployment_summary
    
    echo
    print_color $GREEN "🚀 GitHub自动化部署向导完成！"
    echo
}

# 运行主函数
main "$@" 