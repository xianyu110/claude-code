const fs = require('fs');
const path = require('path');

class DataProcessor {
    constructor() {
        this.dataDir = './data';
        this.masterFile = path.join(this.dataDir, 'master_topics.json');
        this.historyFile = path.join(this.dataDir, 'scraping_history.json');
    }

    // 加载历史数据
    loadMasterData() {
        if (fs.existsSync(this.masterFile)) {
            try {
                const data = fs.readFileSync(this.masterFile, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.log('📝 创建新的主数据文件');
                return { topics: [], last_updated: null, total_count: 0 };
            }
        }
        return { topics: [], last_updated: null, total_count: 0 };
    }

    // 加载抓取历史
    loadHistory() {
        if (fs.existsSync(this.historyFile)) {
            try {
                const data = fs.readFileSync(this.historyFile, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                return { scrapes: [] };
            }
        }
        return { scrapes: [] };
    }

    // 计算文本相似度（简单版本）
    calculateSimilarity(str1, str2) {
        const len1 = str1.length;
        const len2 = str2.length;
        const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

        for (let i = 0; i <= len1; i++) matrix[0][i] = i;
        for (let j = 0; j <= len2; j++) matrix[j][0] = j;

        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1,
                    matrix[j - 1][i] + 1,
                    matrix[j - 1][i - 1] + indicator
                );
            }
        }

        const distance = matrix[len2][len1];
        const maxLen = Math.max(len1, len2);
        return (maxLen - distance) / maxLen;
    }

    // 检查是否为重复话题
    isDuplicate(newTopic, existingTopics) {
        for (const existing of existingTopics) {
            // 标题相似度检查
            const titleSimilarity = this.calculateSimilarity(
                newTopic.title.toLowerCase(),
                existing.title.toLowerCase()
            );

            // 作者相同且标题相似度高于70%视为重复
            if (existing.author === newTopic.author && titleSimilarity > 0.7) {
                return { isDupe: true, existing: existing };
            }

            // 标题相似度高于85%视为重复
            if (titleSimilarity > 0.85) {
                return { isDupe: true, existing: existing };
            }
        }
        return { isDupe: false };
    }

    // 处理新数据
    processNewData(newTopics) {
        console.log('🔄 开始处理新数据...');
        
        const masterData = this.loadMasterData();
        const results = {
            new: [],
            updated: [],
            duplicates: [],
            total_processed: newTopics.length
        };

        newTopics.forEach((newTopic, index) => {
            const dupeCheck = this.isDuplicate(newTopic, masterData.topics);
            
            if (dupeCheck.isDupe) {
                // 如果是重复的，检查是否需要更新数据
                const existing = dupeCheck.existing;
                let needsUpdate = false;

                if (newTopic.likes > existing.likes) {
                    existing.likes = newTopic.likes;
                    existing.heat_level = newTopic.heat_level;
                    existing.last_updated = newTopic.scraped_time;
                    needsUpdate = true;
                }

                if (needsUpdate) {
                    results.updated.push({
                        title: existing.title,
                        old_likes: existing.likes,
                        new_likes: newTopic.likes
                    });
                } else {
                    results.duplicates.push(newTopic.title);
                }
            } else {
                // 新话题
                newTopic.id = `topic_${Date.now()}_${index}`;
                newTopic.first_seen = newTopic.scraped_time;
                newTopic.trend_data = [{ date: newTopic.scraped_time, likes: newTopic.likes }];
                
                masterData.topics.push(newTopic);
                results.new.push(newTopic);
            }
        });

        // 更新主数据文件
        masterData.last_updated = new Date().toISOString();
        masterData.total_count = masterData.topics.length;
        
        // 按点赞数排序
        masterData.topics.sort((a, b) => b.likes - a.likes);

        this.saveMasterData(masterData);
        this.saveProcessingResults(results);

        console.log(`✅ 数据处理完成:`);
        console.log(`   - 新增话题: ${results.new.length}`);
        console.log(`   - 更新话题: ${results.updated.length}`);
        console.log(`   - 重复话题: ${results.duplicates.length}`);

        return results;
    }

    // 保存主数据
    saveMasterData(data) {
        fs.writeFileSync(this.masterFile, JSON.stringify(data, null, 2), 'utf8');
        console.log(`💾 主数据已更新: ${data.total_count} 个话题`);
    }

    // 保存处理结果
    saveProcessingResults(results) {
        const timestamp = new Date().toISOString();
        const history = this.loadHistory();
        
        history.scrapes.push({
            timestamp: timestamp,
            results: results
        });

        // 只保留最近30天的历史
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        history.scrapes = history.scrapes.filter(
            scrape => new Date(scrape.timestamp) > thirtyDaysAgo
        );

        fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2), 'utf8');
    }

    // 生成每日报告
    generateDailyReport(results) {
        const today = new Date().toISOString().split('T')[0];
        const reportFile = path.join(this.dataDir, `daily_report_${today}.md`);

        const report = `# 小红书AI话题每日报告
## ${today}

### 📊 数据概览
- 处理话题总数: ${results.total_processed}
- 新增话题: ${results.new.length}
- 更新话题: ${results.updated.length}
- 重复话题: ${results.duplicates.length}

### 🔥 新增热门话题
${results.new.slice(0, 10).map((topic, index) => 
    `${index + 1}. **${topic.title}** - ${topic.author} (${topic.likes}赞)`
).join('\n')}

### 📈 数据更新话题
${results.updated.slice(0, 5).map((update, index) => 
    `${index + 1}. **${update.title}** - 点赞数: ${update.old_likes} → ${update.new_likes}`
).join('\n')}

### 💡 数据洞察
- 平均点赞数: ${Math.round(results.new.reduce((sum, t) => sum + t.likes, 0) / results.new.length || 0)}
- 高热度话题: ${results.new.filter(t => t.heat_level === '高热度').length}个

---
*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
`;

        fs.writeFileSync(reportFile, report, 'utf8');
        console.log(`📋 每日报告已生成: ${reportFile}`);
        return reportFile;
    }

    // 清理旧文件
    cleanupOldFiles() {
        const files = fs.readdirSync(this.dataDir);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        files.forEach(file => {
            if (file.startsWith('xiaohongshu_ai_topics_') && file.endsWith('.csv')) {
                const filePath = path.join(this.dataDir, file);
                const stats = fs.statSync(filePath);
                
                if (stats.mtime < thirtyDaysAgo) {
                    fs.unlinkSync(filePath);
                    console.log(`🗑️ 已删除旧文件: ${file}`);
                }
            }
        });
    }

    // 导出为飞书格式的CSV
    exportForFeishu() {
        const masterData = this.loadMasterData();
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `feishu_export_${timestamp}.csv`;
        const filepath = path.join(this.dataDir, filename);

        // 飞书格式的CSV头部
        const headers = '序号,话题标题,作者,点赞数,话题分类,热度等级,首次发现,最后更新,来源\n';
        
        let csvContent = headers;
        masterData.topics.slice(0, 100).forEach((topic, index) => { // 限制前100个
            const row = [
                index + 1,
                `"${topic.title.replace(/"/g, '""')}"`,
                `"${topic.author.replace(/"/g, '""')}"`,
                topic.likes,
                topic.category,
                topic.heat_level,
                topic.first_seen || topic.scraped_time,
                topic.last_updated || topic.scraped_time,
                topic.source
            ].join(',');
            csvContent += row + '\n';
        });

        fs.writeFileSync(filepath, csvContent, 'utf8');
        console.log(`📤 飞书导出文件已生成: ${filepath}`);
        return filepath;
    }
}

module.exports = DataProcessor; 