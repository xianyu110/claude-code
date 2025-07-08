const XiaohongshuAIScraper = require('./xiaohongshu_auto_scraper');
const DataProcessor = require('./data_processor');
const FeishuUploader = require('./feishu_uploader');
const fs = require('fs');
const path = require('path');

class DailyAIScraper {
    constructor() {
        this.logFile = './data/daily_scraper.log';
        this.scraper = new XiaohongshuAIScraper();
        this.processor = new DataProcessor();
        this.uploader = new FeishuUploader();
        this.ensureDataDir();
    }

    ensureDataDir() {
        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data', { recursive: true });
        }
    }

    // 记录日志
    log(message, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level}] ${message}\n`;
        
        console.log(`[${level}] ${message}`);
        
        try {
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            console.error('写入日志失败:', error.message);
        }
    }

    // 发送通知（简单版本）
    async sendNotification(title, message, success = true) {
        const emoji = success ? '✅' : '❌';
        this.log(`${emoji} ${title}: ${message}`, success ? 'SUCCESS' : 'ERROR');
        
        // 可以在这里添加邮件通知、企业微信通知等
        // 示例：保存通知到文件
        const notificationFile = './data/notifications.json';
        let notifications = [];
        
        if (fs.existsSync(notificationFile)) {
            try {
                notifications = JSON.parse(fs.readFileSync(notificationFile, 'utf8'));
            } catch (error) {
                notifications = [];
            }
        }
        
        notifications.push({
            timestamp: new Date().toISOString(),
            title: title,
            message: message,
            success: success,
            type: 'daily_scraper'
        });
        
        // 只保留最近100条通知
        if (notifications.length > 100) {
            notifications = notifications.slice(-100);
        }
        
        fs.writeFileSync(notificationFile, JSON.stringify(notifications, null, 2));
    }

    // 主要执行流程
    async run() {
        const startTime = new Date();
        this.log('🚀 开始每日AI话题采集任务');
        
        try {
            // 第一步：采集数据
            this.log('📱 开始采集小红书AI话题数据...');
            const scrapingResult = await this.scraper.run();
            
            if (!scrapingResult.success) {
                throw new Error(`数据采集失败: ${scrapingResult.error || '未知错误'}`);
            }
            
            this.log(`✅ 成功采集 ${scrapingResult.count} 个AI话题`);
            
            // 第二步：处理数据
            this.log('🔄 开始处理和去重数据...');
            const processingResult = this.processor.processNewData(scrapingResult.topics);
            
            this.log(`✅ 数据处理完成: 新增${processingResult.new.length}, 更新${processingResult.updated.length}, 重复${processingResult.duplicates.length}`);
            
            // 生成每日报告
            const reportFile = this.processor.generateDailyReport(processingResult);
            this.log(`📋 每日报告已生成: ${reportFile}`);
            
            // 第三步：导出飞书格式
            this.log('📤 准备飞书上传文件...');
            const feishuFile = this.processor.exportForFeishu();
            
            // 第四步：上传到飞书
            this.log('🚀 开始上传数据到飞书...');
            const uploadResult = await this.uploader.uploadData(feishuFile);
            
            if (uploadResult) {
                this.log('✅ 数据已成功上传到飞书');
            } else {
                this.log('⚠️ 飞书上传可能失败，请检查', 'WARN');
            }
            
            // 清理旧文件
            this.processor.cleanupOldFiles();
            
            // 计算执行时间
            const duration = Math.round((new Date() - startTime) / 1000);
            
            // 发送成功通知
            await this.sendNotification(
                '每日AI话题采集完成',
                `成功采集${scrapingResult.count}个话题，新增${processingResult.new.length}个，用时${duration}秒`,
                true
            );
            
            this.log(`🎉 每日采集任务完成！总用时: ${duration}秒`);
            
            return {
                success: true,
                stats: {
                    scraped: scrapingResult.count,
                    new_topics: processingResult.new.length,
                    updated_topics: processingResult.updated.length,
                    duplicates: processingResult.duplicates.length,
                    duration: duration
                }
            };
            
        } catch (error) {
            this.log(`💥 任务执行失败: ${error.message}`, 'ERROR');
            console.error('详细错误信息:', error);
            
            // 发送失败通知
            await this.sendNotification(
                '每日AI话题采集失败',
                error.message,
                false
            );
            
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 测试模式（不上传到飞书）
    async testRun() {
        this.log('🧪 运行测试模式');
        
        try {
            // 只执行采集和处理，不上传
            const scrapingResult = await this.scraper.run();
            
            if (scrapingResult.success) {
                const processingResult = this.processor.processNewData(scrapingResult.topics);
                const reportFile = this.processor.generateDailyReport(processingResult);
                
                this.log('✅ 测试运行完成');
                this.log(`📊 采集: ${scrapingResult.count}, 新增: ${processingResult.new.length}`);
                this.log(`📋 报告: ${reportFile}`);
                
                return { success: true, test: true };
            } else {
                throw new Error('测试采集失败');
            }
            
        } catch (error) {
            this.log(`❌ 测试运行失败: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    // 只上传已有数据到飞书
    async uploadOnly() {
        this.log('📤 仅执行飞书上传');
        
        try {
            const feishuFile = this.processor.exportForFeishu();
            const uploadResult = await this.uploader.uploadData(feishuFile);
            
            if (uploadResult) {
                this.log('✅ 上传完成');
                return { success: true, upload: true };
            } else {
                throw new Error('上传失败');
            }
            
        } catch (error) {
            this.log(`❌ 上传失败: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }

    // 设置飞书配置
    async setupFeishu() {
        this.log('🧙‍♂️ 开始飞书设置向导');
        
        try {
            await this.uploader.setupWizard();
            this.log('✅ 飞书配置完成');
            return { success: true, setup: true };
        } catch (error) {
            this.log(`❌ 飞书设置失败: ${error.message}`, 'ERROR');
            return { success: false, error: error.message };
        }
    }
}

// 命令行参数处理
async function main() {
    const scraper = new DailyAIScraper();
    const args = process.argv.slice(2);
    const command = args[0] || 'run';
    
    switch (command) {
        case 'test':
            console.log('🧪 测试模式');
            await scraper.testRun();
            break;
            
        case 'upload':
            console.log('📤 仅上传模式');
            await scraper.uploadOnly();
            break;
            
        case 'setup':
            console.log('⚙️ 设置模式');
            await scraper.setupFeishu();
            break;
            
        case 'run':
        default:
            console.log('🔄 正常运行模式');
            const result = await scraper.run();
            process.exit(result.success ? 0 : 1);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    main().catch(error => {
        console.error('💥 程序异常退出:', error);
        process.exit(1);
    });
}

module.exports = DailyAIScraper; 