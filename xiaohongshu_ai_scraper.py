#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
小红书AI话题爬虫
爬取小红书关于AI的最热话题
"""

import time
import json
import csv
import re
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException, NoSuchElementException

class XiaohongshuAIScraper:
    def __init__(self, headless=False):
        """初始化爬虫"""
        self.setup_driver(headless)
        self.hot_topics = []
        
    def setup_driver(self, headless=False):
        """设置Chrome浏览器"""
        chrome_options = Options()
        if headless:
            chrome_options.add_argument('--headless')
        
        # 设置用户代理，模拟真实浏览器
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        chrome_options.add_argument('--disable-blink-features=AutomationControlled')
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        self.wait = WebDriverWait(self.driver, 10)
        
    def search_ai_topics(self, keyword="AI"):
        """搜索AI相关话题"""
        try:
            print(f"正在搜索关键词: {keyword}")
            
            # 访问小红书首页
            self.driver.get("https://www.xiaohongshu.com")
            time.sleep(3)
            
            # 查找搜索框
            search_box = self.wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input[placeholder*='搜索']"))
            )
            
            # 输入搜索关键词
            search_box.clear()
            search_box.send_keys(keyword)
            search_box.send_keys(Keys.RETURN)
            
            time.sleep(3)
            
            # 等待搜索结果加载
            self.wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".feeds-container")))
            
            print("搜索结果加载完成")
            return True
            
        except TimeoutException:
            print("搜索超时，可能需要手动处理验证码")
            return False
        except Exception as e:
            print(f"搜索出错: {e}")
            return False
    
    def extract_hot_topics(self):
        """提取热门话题"""
        try:
            # 滚动页面加载更多内容
            self.scroll_page()
            
            # 查找笔记卡片
            note_cards = self.driver.find_elements(By.CSS_SELECTOR, ".note-item")
            
            print(f"找到 {len(note_cards)} 个笔记")
            
            for i, card in enumerate(note_cards[:20]):  # 限制前20个
                try:
                    topic_data = self.extract_note_data(card)
                    if topic_data:
                        self.hot_topics.append(topic_data)
                        print(f"提取第 {i+1} 个话题: {topic_data['title'][:30]}...")
                        
                except Exception as e:
                    print(f"提取第 {i+1} 个笔记时出错: {e}")
                    continue
                    
        except Exception as e:
            print(f"提取话题时出错: {e}")
    
    def extract_note_data(self, card):
        """提取单个笔记的数据"""
        try:
            data = {}
            
            # 标题
            title_element = card.find_element(By.CSS_SELECTOR, ".title")
            data['title'] = title_element.text.strip() if title_element else "无标题"
            
            # 作者
            try:
                author_element = card.find_element(By.CSS_SELECTOR, ".author-name")
                data['author'] = author_element.text.strip()
            except NoSuchElementException:
                data['author'] = "未知作者"
            
            # 点赞数
            try:
                like_element = card.find_element(By.CSS_SELECTOR, ".like-count")
                data['likes'] = self.parse_count(like_element.text)
            except NoSuchElementException:
                data['likes'] = 0
            
            # 链接
            try:
                link_element = card.find_element(By.CSS_SELECTOR, "a")
                data['url'] = link_element.get_attribute('href')
            except NoSuchElementException:
                data['url'] = ""
            
            # 时间戳
            data['scraped_time'] = datetime.now().isoformat()
            
            return data
            
        except Exception as e:
            print(f"提取笔记数据时出错: {e}")
            return None
    
    def parse_count(self, count_text):
        """解析点赞数等数字"""
        if not count_text:
            return 0
        
        # 处理 "1.2万" 等格式
        if '万' in count_text:
            number = float(count_text.replace('万', '')) * 10000
        elif 'k' in count_text.lower():
            number = float(count_text.lower().replace('k', '')) * 1000
        else:
            # 提取数字
            numbers = re.findall(r'\d+\.?\d*', count_text)
            number = float(numbers[0]) if numbers else 0
        
        return int(number)
    
    def scroll_page(self):
        """滚动页面加载更多内容"""
        print("滚动页面加载更多内容...")
        
        # 滚动3次
        for i in range(3):
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            print(f"第 {i+1} 次滚动完成")
    
    def save_to_csv(self, filename="xiaohongshu_ai_topics.csv"):
        """保存数据到CSV文件"""
        if not self.hot_topics:
            print("没有数据可保存")
            return
        
        with open(filename, 'w', newline='', encoding='utf-8') as file:
            fieldnames = ['title', 'author', 'likes', 'url', 'scraped_time']
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            
            writer.writeheader()
            for topic in self.hot_topics:
                writer.writerow(topic)
        
        print(f"数据已保存到 {filename}")
    
    def save_to_json(self, filename="xiaohongshu_ai_topics.json"):
        """保存数据到JSON文件"""
        if not self.hot_topics:
            print("没有数据可保存")
            return
        
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(self.hot_topics, file, ensure_ascii=False, indent=2)
        
        print(f"数据已保存到 {filename}")
    
    def print_results(self):
        """打印结果"""
        print("\n=== 小红书AI热门话题 ===")
        for i, topic in enumerate(self.hot_topics, 1):
            print(f"\n{i}. {topic['title']}")
            print(f"   作者: {topic['author']}")
            print(f"   点赞: {topic['likes']}")
            print(f"   链接: {topic['url']}")
    
    def run(self, keywords=["AI", "人工智能", "ChatGPT", "机器学习"]):
        """运行爬虫"""
        try:
            print("开始爬取小红书AI话题...")
            
            for keyword in keywords:
                if self.search_ai_topics(keyword):
                    self.extract_hot_topics()
                    time.sleep(2)  # 避免请求过快
                else:
                    print(f"搜索关键词 '{keyword}' 失败")
            
            # 按点赞数排序
            self.hot_topics.sort(key=lambda x: x['likes'], reverse=True)
            
            # 打印结果
            self.print_results()
            
            # 保存数据
            self.save_to_csv()
            self.save_to_json()
            
            print(f"\n爬取完成！共获取 {len(self.hot_topics)} 个话题")
            
        except Exception as e:
            print(f"爬取过程中出错: {e}")
        finally:
            self.close()
    
    def close(self):
        """关闭浏览器"""
        if hasattr(self, 'driver'):
            self.driver.quit()
            print("浏览器已关闭")

def main():
    """主函数"""
    print("小红书AI话题爬虫")
    print("=" * 50)
    
    # 创建爬虫实例（headless=False显示浏览器）
    scraper = XiaohongshuAIScraper(headless=False)
    
    try:
        # 运行爬虫
        scraper.run()
    except KeyboardInterrupt:
        print("\n用户中断爬取")
    except Exception as e:
        print(f"程序异常: {e}")
    finally:
        scraper.close()

if __name__ == "__main__":
    main()