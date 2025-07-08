const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class FeishuUploader {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || 'https://www.feishu.cn';
        this.tableUrl = options.tableUrl || null; // 用户的飞书表格URL
        this.browser = null;
        this.page = null;
        this.uploadDir = './data';
        this.configFile = './feishu_config.json';
        this.loadConfig();
    }

    // 加载配置
    loadConfig() {
        if (fs.existsSync(this.configFile)) {
            try {
                const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
                this.tableUrl = config.tableUrl;
                this.autoLogin = config.autoLogin || false;
                console.log('📋 已加载飞书配置');
            } catch (error) {
                console.log('⚠️ 配置文件读取失败，将使用默认设置');
            }
        }
    }

    // 保存配置
    saveConfig() {
        const config = {
            tableUrl: this.tableUrl,
            autoLogin: this.autoLogin,
            lastUpdated: new Date().toISOString()
        };
        fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
        console.log('💾 飞书配置已保存');
    }

    // 初始化浏览器
    async initialize() {
        console.log('🌐 启动浏览器进行飞书操作...');
        
        // 检测运行环境
        const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
        const headless = process.env.HEADLESS === 'true' || isGitHubActions;
        
        if (isGitHubActions) {
            console.log('⚠️ 检测到GitHub Actions环境，飞书上传将跳过浏览器操作');
            console.log('💡 请使用飞书API或手动上传生成的CSV文件');
            return false; // 在GitHub Actions中不使用浏览器上传
        }
        
        this.browser = await chromium.launch({
            headless: headless,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });

        this.page = await this.browser.newPage();
        
        // 设置较长的超时时间
        this.page.setDefaultTimeout(60000);
        
        return true;
    }

    // 自动登录飞书（如果需要）
    async autoLogin() {
        console.log('🔐 检查飞书登录状态...');
        
        try {
            await this.page.goto(this.baseUrl, { waitUntil: 'networkidle' });
            await this.page.waitForTimeout(3000);

            // 检查是否已登录
            const isLoggedIn = await this.page.evaluate(() => {
                return document.querySelector('.workspace, .user-avatar, [data-testid="workspace"]') !== null;
            });

            if (!isLoggedIn) {
                console.log('⏳ 请在浏览器中完成飞书登录...');
                console.log('💡 登录完成后，程序将自动继续');
                
                // 等待用户手动登录
                await this.page.waitForSelector('.workspace, .user-avatar, [data-testid="workspace"]', {
                    timeout: 300000 // 5分钟超时
                });
                
                console.log('✅ 登录成功！');
            } else {
                console.log('✅ 已处于登录状态');
            }

            return true;
        } catch (error) {
            console.error('❌ 登录过程出错:', error.message);
            return false;
        }
    }

    // 导航到指定的多维表格
    async navigateToTable() {
        if (!this.tableUrl) {
            console.log('⚠️ 请先设置飞书表格URL');
            console.log('💡 您可以手动复制表格URL，或运行设置向导');
            
            // 让用户手动导航到表格
            console.log('📋 请在浏览器中打开您的多维表格，然后按回车继续...');
            
            // 简单的控制台输入等待
            await new Promise(resolve => {
                process.stdin.once('data', () => resolve());
            });
            
            // 获取当前URL作为表格URL
            this.tableUrl = this.page.url();
            this.saveConfig();
            
            console.log(`✅ 已保存表格URL: ${this.tableUrl}`);
        } else {
            console.log('📊 导航到多维表格...');
            await this.page.goto(this.tableUrl, { waitUntil: 'networkidle' });
        }

        await this.page.waitForTimeout(3000);
        return true;
    }

    // 清空现有数据（可选）
    async clearExistingData() {
        console.log('🗑️ 检查是否需要清空现有数据...');
        
        try {
            // 查找表格中的数据行
            const hasData = await this.page.evaluate(() => {
                const rows = document.querySelectorAll('tr[data-row-index]');
                return rows.length > 1; // 除了标题行
            });

            if (hasData) {
                console.log('⚠️ 发现现有数据，将进行追加而不是替换');
                return false;
            }

            return true;
        } catch (error) {
            console.log('⚠️ 无法检查现有数据，将直接追加');
            return false;
        }
    }

    // 上传CSV文件
    async uploadCSVFile(csvFilePath) {
        console.log(`📤 开始上传文件: ${csvFilePath}`);
        
        try {
            // 查找导入按钮或新建按钮
            const importButton = await this.page.waitForSelector(
                'button:has-text("导入"), button:has-text("导入Excel"), .import-btn, [data-testid="import"]',
                { timeout: 10000 }
            ).catch(() => null);

            if (importButton) {
                await importButton.click();
                console.log('🎯 点击导入按钮');
            } else {
                console.log('⚠️ 未找到导入按钮，请手动点击导入');
                await this.page.waitForTimeout(5000);
            }

            // 等待文件选择器
            const fileInput = await this.page.waitForSelector('input[type="file"]', { timeout: 10000 }).catch(() => null);
            
            if (fileInput) {
                await fileInput.setInputFiles(csvFilePath);
                console.log('📁 文件已选择');
                
                // 等待上传完成
                await this.page.waitForTimeout(3000);
                
                // 查找确认按钮
                const confirmButton = await this.page.waitForSelector(
                    'button:has-text("确认"), button:has-text("确定"), button:has-text("上传"), .confirm-btn',
                    { timeout: 10000 }
                ).catch(() => null);

                if (confirmButton) {
                    await confirmButton.click();
                    console.log('✅ 确认上传');
                    
                    // 等待上传完成
                    await this.page.waitForTimeout(5000);
                    
                    return true;
                } else {
                    console.log('⚠️ 请手动确认上传');
                    return false;
                }
            } else {
                console.log('❌ 未找到文件选择器');
                return false;
            }

        } catch (error) {
            console.error('❌ 上传过程出错:', error.message);
            return false;
        }
    }

    // 手动辅助上传模式
    async assistedUpload(csvFilePath) {
        console.log('🤝 启动辅助上传模式...');
        console.log('📋 请按照提示在浏览器中完成操作：');
        console.log('');
        console.log('1. 📊 确认您在正确的多维表格页面');
        console.log('2. 🔄 点击"导入Excel"或"导入"按钮');
        console.log('3. 📁 选择文件时，选择以下文件：');
        console.log(`   ${path.resolve(csvFilePath)}`);
        console.log('4. ✅ 确认导入设置并完成导入');
        console.log('');
        console.log('🔄 完成后按回车继续...');
        
        // 等待用户确认
        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });
        
        console.log('✅ 辅助上传完成');
        return true;
    }

    // API模式上传到飞书（适用于云环境）
    async uploadViaAPI(csvFilePath) {
        console.log('🌐 使用API模式上传到飞书...');
        
        // 这里可以实现飞书API上传逻辑
        // 由于飞书API需要复杂的认证流程，目前先生成文件供手动上传
        
        console.log('📁 CSV文件已准备：', csvFilePath);
        console.log('💡 请手动下载此文件并上传到飞书多维表格');
        
        // 保存上传日志
        const uploadLog = {
            timestamp: new Date().toISOString(),
            file: csvFilePath,
            method: 'api_ready',
            status: 'file_generated'
        };
        
        this.saveUploadLog(uploadLog);
        return true;
    }

    // 主上传函数
    async uploadData(csvFilePath) {
        try {
            console.log('🚀 开始飞书数据上传流程...');
            
            if (!fs.existsSync(csvFilePath)) {
                throw new Error(`文件不存在: ${csvFilePath}`);
            }

            // 检测运行环境
            const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
            
            if (isGitHubActions) {
                // 在GitHub Actions中使用API模式
                return await this.uploadViaAPI(csvFilePath);
            }

            const initSuccess = await this.initialize();
            if (!initSuccess) {
                console.log('⚠️ 浏览器初始化失败，使用API模式');
                return await this.uploadViaAPI(csvFilePath);
            }
            
            const loginSuccess = await this.autoLogin();
            if (!loginSuccess) {
                throw new Error('登录失败');
            }

            await this.navigateToTable();
            
            // 尝试自动上传，如果失败则使用辅助模式
            console.log('🎯 尝试自动上传...');
            const autoSuccess = await this.uploadCSVFile(csvFilePath);
            
            if (!autoSuccess) {
                console.log('⚠️ 自动上传失败，切换到辅助模式');
                await this.assistedUpload(csvFilePath);
            }

            console.log('🎉 数据上传完成！');
            
            // 保存最后上传时间
            const uploadLog = {
                timestamp: new Date().toISOString(),
                file: csvFilePath,
                method: autoSuccess ? 'auto' : 'assisted'
            };
            
            this.saveUploadLog(uploadLog);
            
            return true;

        } catch (error) {
            console.error('💥 上传过程出错:', error.message);
            return false;
        } finally {
            await this.cleanup();
        }
    }

    // 保存上传日志
    saveUploadLog(logEntry) {
        const logFile = path.join(this.uploadDir, 'upload_history.json');
        let logs = [];
        
        if (fs.existsSync(logFile)) {
            try {
                logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
            } catch (error) {
                logs = [];
            }
        }
        
        logs.push(logEntry);
        
        // 只保留最近50条记录
        if (logs.length > 50) {
            logs = logs.slice(-50);
        }
        
        fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
        console.log('📝 上传日志已保存');
    }

    // 设置向导
    async setupWizard() {
        console.log('🧙‍♂️ 飞书上传设置向导');
        console.log('='.repeat(40));
        
        await this.initialize();
        await this.autoLogin();
        
        console.log('📋 请在浏览器中导航到您想要更新的多维表格');
        console.log('✅ 导航完成后，按回车保存配置...');
        
        await new Promise(resolve => {
            process.stdin.once('data', () => resolve());
        });
        
        this.tableUrl = this.page.url();
        this.autoLogin = true;
        this.saveConfig();
        
        console.log('🎉 设置完成！');
        console.log(`📊 表格URL: ${this.tableUrl}`);
        
        await this.cleanup();
    }

    // 清理资源
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔐 浏览器已关闭');
        }
    }
}

module.exports = FeishuUploader; 