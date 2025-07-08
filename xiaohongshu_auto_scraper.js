const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class XiaohongshuAIScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.outputDir = './data';
        this.ensureOutputDir();
    }

    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async initialize() {
        console.log('🚀 启动浏览器...');
        
        // 检测运行环境
        const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
        const headless = process.env.HEADLESS === 'true' || isGitHubActions;
        
        this.browser = await chromium.launch({
            headless: headless,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--no-first-run',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        });
        this.page = await this.browser.newPage();
        
        // 设置用户代理和视口
        await this.page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await this.page.setViewportSize({ width: 1920, height: 1080 });
        
        // 设置超时
        this.page.setDefaultTimeout(30000);
        
        console.log(`🖥️ 浏览器模式: ${headless ? 'Headless' : 'GUI'}`);
    }

    async scrapeAITopics() {
        console.log('📱 访问小红书AI搜索页面...');
        
        try {
            // 访问小红书AI搜索结果页面
            await this.page.goto('https://www.xiaohongshu.com/search_result/?keyword=AI&type=54&source=web_search_result_notes', {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            // 等待页面加载
            await this.page.waitForTimeout(3000);

            console.log('🔍 获取AI话题数据...');
            
            // 滚动页面加载更多内容
            for (let i = 0; i < 3; i++) {
                await this.page.keyboard.press('PageDown');
                await this.page.waitForTimeout(2000);
            }

            // 提取话题数据
            const topics = await this.page.evaluate(() => {
                const items = [];
                
                // 查找所有笔记卡片
                const noteCards = document.querySelectorAll('[data-testid="note-card"], .note-item, .feeds-page .note-item');
                
                noteCards.forEach((card, index) => {
                    try {
                        const titleElement = card.querySelector('.title, .note-title, h3, .feeds-title');
                        const authorElement = card.querySelector('.author, .user-name, .nickname');
                        const likesElement = card.querySelector('.like-count, .interaction-count, .like-wrapper');
                        
                        const title = titleElement?.textContent?.trim() || `AI话题 ${index + 1}`;
                        const author = authorElement?.textContent?.trim() || '未知作者';
                        const likesText = likesElement?.textContent?.trim() || '0';
                        
                        // 提取点赞数（处理k、万等单位）
                        let likes = 0;
                        if (likesText.includes('万')) {
                            likes = Math.round(parseFloat(likesText) * 10000);
                        } else if (likesText.includes('k')) {
                            likes = Math.round(parseFloat(likesText) * 1000);
                        } else {
                            likes = parseInt(likesText.replace(/\D/g, '')) || 0;
                        }

                        if (title && title.length > 5) { // 过滤掉太短的标题
                            items.push({
                                title: title.slice(0, 100), // 限制标题长度
                                author: author.slice(0, 50),
                                likes: likes,
                                category: '小红书AI话题',
                                heat_level: likes > 1000 ? '高热度' : likes > 100 ? '中等热度' : '一般热度',
                                scraped_time: new Date().toISOString().split('T')[0],
                                source: '小红书'
                            });
                        }
                    } catch (err) {
                        console.log(`解析第${index}个项目时出错:`, err.message);
                    }
                });

                return items;
            });

            console.log(`✅ 成功获取 ${topics.length} 个AI话题`);
            return topics;

        } catch (error) {
            console.error('❌ 获取数据时出错:', error);
            return [];
        }
    }

    async saveToCSV(topics) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `xiaohongshu_ai_topics_${timestamp}.csv`;
        const filepath = path.join(this.outputDir, filename);

        // CSV头部
        const headers = '序号,话题标题,作者,点赞数,话题分类,热度等级,获取时间,来源\n';
        
        // 生成CSV内容
        let csvContent = headers;
        topics.forEach((topic, index) => {
            const row = [
                index + 1,
                `"${topic.title.replace(/"/g, '""')}"`, // 转义双引号
                `"${topic.author.replace(/"/g, '""')}"`,
                topic.likes,
                topic.category,
                topic.heat_level,
                topic.scraped_time,
                topic.source
            ].join(',');
            csvContent += row + '\n';
        });

        fs.writeFileSync(filepath, csvContent, 'utf8');
        console.log(`💾 数据已保存到: ${filepath}`);
        return filepath;
    }

    async saveToJSON(topics) {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `xiaohongshu_ai_topics_${timestamp}.json`;
        const filepath = path.join(this.outputDir, filename);

        const data = {
            scrape_date: timestamp,
            total_count: topics.length,
            topics: topics
        };

        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`📄 JSON数据已保存到: ${filepath}`);
        return filepath;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔐 浏览器已关闭');
        }
    }

    // 主要执行函数
    async run() {
        try {
            await this.initialize();
            const topics = await this.scrapeAITopics();
            
            if (topics.length > 0) {
                await this.saveToCSV(topics);
                await this.saveToJSON(topics);
                
                // 输出统计信息
                console.log('\n📊 数据统计:');
                console.log(`- 总计话题: ${topics.length}`);
                console.log(`- 高热度话题: ${topics.filter(t => t.heat_level === '高热度').length}`);
                console.log(`- 平均点赞数: ${Math.round(topics.reduce((sum, t) => sum + t.likes, 0) / topics.length)}`);
                
                return {
                    success: true,
                    count: topics.length,
                    topics: topics
                };
            } else {
                console.log('⚠️ 未获取到有效数据');
                return { success: false, count: 0 };
            }
            
        } catch (error) {
            console.error('💥 执行过程中出错:', error);
            return { success: false, error: error.message };
        } finally {
            await this.cleanup();
        }
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const scraper = new XiaohongshuAIScraper();
    scraper.run().then(result => {
        if (result.success) {
            console.log('🎉 自动化采集完成!');
            process.exit(0);
        } else {
            console.log('❌ 采集失败');
            process.exit(1);
        }
    });
}

module.exports = XiaohongshuAIScraper; 