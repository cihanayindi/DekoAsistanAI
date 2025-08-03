import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager

def ikea_link_scraper():
    """
    IKEA üçlü kanepe kategorisindeki ürün linklerini toplar
    """
    url = "https://www.ikea.com.tr/kategori/mutfak-dolaplari"
    
    # Chrome options
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # WebDriver başlat
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    try:
        print(f"Siteye gidiliyor: {url}")
        driver.get(url)
        
        # Sayfanın yüklenmesini bekle
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.ID, "productList")))
        
        # Sayfayı scroll ederek daha fazla ürün yükle
        print("Sayfa scroll ediliyor...")
        last_height = driver.execute_script("return document.body.scrollHeight")
        
        while True:
            # Sayfanın sonuna scroll et
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)  # Yeni içeriğin yüklenmesi için bekle
            
            # Yeni scroll yüksekliğini kontrol et
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
        
        print("Ürün linkleri toplanıyor...")
        links = []
        counter = 1
        max_links = 30  # Maksimum 30 link topla
        
        # Counter ile xpath kullanarak linkleri topla
        while len(links) < max_links:
            try:
                xpath = f'//*[@id="productList"]/div[3]/div[{counter}]/div/div/div[1]/a'
                element = driver.find_element(By.XPATH, xpath)
                link = element.get_attribute('href')
                
                if link:
                    links.append({
                        'counter': counter,
                        'link': link,
                        'xpath': xpath
                    })
                    print(f"Link {counter}: {link}")
                
                counter += 1
                
            except NoSuchElementException:
                print(f"Element bulunamadı, counter: {counter}")
                break
            except Exception as e:
                print(f"Hata oluştu counter {counter}: {str(e)}")
                break
        
        if len(links) >= max_links:
            print(f"Maksimum {max_links} link toplandı, işlem durduruluyor.")
        
        print(f"\nToplam {len(links)} ürün linki toplandı")
        
        # Sonuçları TXT dosyasına kaydet
        with open('ikea_urun_linkleri.txt', 'w', encoding='utf-8') as f:
            for item in links:
                f.write(item['link'] + '\n')
        
        print("Linkler 'ikea_urun_linkleri.txt' dosyasına kaydedildi")
        
        return links
        
    except TimeoutException:
        print("Sayfa yüklenirken zaman aşımı oluştu")
        return []
    except Exception as e:
        print(f"Beklenmeyen hata: {str(e)}")
        return []
    finally:
        driver.quit()

def print_links_summary(links):
    """
    Toplanan linklerin özetini yazdır
    """
    if not links:
        print("Hiç link toplanamadı")
        return
    
    print("\n=== ÖZET ===")
    print(f"Toplam link sayısı: {len(links)}")
    print(f"İlk link: {links[0]['link'] if links else 'Yok'}")
    print(f"Son link: {links[-1]['link'] if links else 'Yok'}")
    
    # İlk 5 linki göster
    print("\nİlk 5 link:")
    for i, item in enumerate(links[:5]):
        print(f"{i+1}. {item['link']}")

if __name__ == "__main__":
    print("IKEA Ürün Link Toplayıcı Başlatılıyor...")
    print("=" * 50)
    
    links = ikea_link_scraper()
    print_links_summary(links)