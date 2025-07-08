from playwright.sync_api import sync_playwright
import time

def access_baidu():
    with sync_playwright() as p:
        # 启动浏览器
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        
        try:
            # 访问百度首页
            print("正在访问百度首页...")
            page.goto("https://www.baidu.com")
            
            # 等待页面加载
            page.wait_for_selector("#kw")
            
            # 获取页面标题
            title = page.title()
            print(f"页面标题: {title}")
            
            # 获取页面URL
            url = page.url
            print(f"当前URL: {url}")
            
            # 截图
            page.screenshot(path="baidu_homepage.png")
            print("已保存截图: baidu_homepage.png")
            
            # 等待3秒以便观察
            time.sleep(3)
            
        except Exception as e:
            print(f"访问失败: {e}")
        finally:
            # 关闭浏览器
            browser.close()

if __name__ == "__main__":
    access_baidu()