#!/usr/bin/env python3
"""
IKEA Ürün Görseli İndirici

Bu script, JSON dosyasındaki IKEA ürün linklerinden görselleri indirip
belirtilen dosya yollarına kaydeder.

Kullanım:
    python image_downloader.py koltuklar.json
"""

import json
import os
import sys
import requests
from urllib.parse import urljoin
from bs4 import BeautifulSoup
import time
import re
from pathlib import Path

class IkeaImageDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
    
    def extract_main_image_from_page(self, url):
        """IKEA ürün sayfasından ana görselin URL'sini çıkarır"""
        try:
            print(f"Sayfa indiriliyor: {url}")
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Ana ürün görselini bul - birkaç farklı selector dene
            image_selectors = [
                'img[src*="image-ikea.mncdn.com/urunler/500_500"]',
                'img[data-zoom*="image-ikea.mncdn.com"]',
                'img[src*="PE"]',
                '.product-image img',
                '.gallery img',
                'img[alt*="IKEA"]'
            ]
            
            for selector in image_selectors:
                img_tag = soup.select_one(selector)
                if img_tag:
                    # src veya data-zoom attribute'unu kontrol et
                    img_url = img_tag.get('src') or img_tag.get('data-zoom')
                    if img_url and 'image-ikea.mncdn.com' in img_url:
                        # Eğer küçük görsel ise büyük haline çevir
                        if '500_500' in img_url:
                            img_url = img_url.replace('500_500', '2000_2000')
                        print(f"Görsel URL bulundu: {img_url}")
                        return img_url
            
            # Hiçbir görsel bulunamadıysa tüm img taglerini kontrol et
            all_imgs = soup.find_all('img')
            for img in all_imgs:
                src = img.get('src', '')
                if 'image-ikea.mncdn.com' in src and 'PE' in src:
                    if '500_500' in src:
                        src = src.replace('500_500', '2000_2000')
                    print(f"Alternatif görsel URL bulundu: {src}")
                    return src
            
            print("Hiçbir uygun görsel bulunamadı")
            return None
            
        except Exception as e:
            print(f"Sayfa işlenirken hata: {e}")
            return None
    
    def download_image(self, image_url, file_path):
        """Görseli indirir ve belirtilen yola kaydeder"""
        try:
            # Dizini oluştur
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            print(f"Görsel indiriliyor: {image_url}")
            response = self.session.get(image_url, timeout=30)
            response.raise_for_status()
            
            # Dosyayı kaydet
            with open(file_path, 'wb') as f:
                f.write(response.content)
            
            print(f"Görsel kaydedildi: {file_path}")
            return True
            
        except Exception as e:
            print(f"Görsel indirilirken hata: {e}")
            return False
    
    def process_json_file(self, json_file_path):
        """JSON dosyasını işler ve görselleri indirir"""
        try:
            # JSON dosyasını oku
            with open(json_file_path, 'r', encoding='utf-8') as f:
                products = json.load(f)
            
            print(f"{len(products)} ürün bulundu")
            
            success_count = 0
            fail_count = 0
            
            for i, product in enumerate(products, 1):
                print(f"\n--- İşleniyor {i}/{len(products)} ---")
                print(f"Ürün: {product.get('product_name', 'Bilinmeyen')}")
                
                product_link = product.get('product_link')
                image_path = product.get('image_path')
                
                if not product_link:
                    print("Ürün linki bulunamadı, atlanıyor...")
                    fail_count += 1
                    continue
                
                if not image_path:
                    print("Görsel yolu bulunamadı, atlanıyor...")
                    fail_count += 1
                    continue
                
                # JSON'daki path'i düzelt (mutlak yolu relatif yola çevir)
                if image_path.startswith('/data/'):
                    local_image_path = image_path.replace('/data/', '')
                elif image_path.startswith('backend/data/'):
                    local_image_path = image_path.replace('backend/data/', '')
                elif image_path.startswith('data/'):
                    local_image_path = image_path.replace('data/', '')
                else:
                    local_image_path = image_path
                
                # Eğer dosya zaten varsa atla
                if os.path.exists(local_image_path):
                    print(f"Dosya zaten mevcut: {local_image_path}")
                    success_count += 1
                    continue
                
                # Web sayfasından görsel URL'sini çıkar
                image_url = self.extract_main_image_from_page(product_link)
                
                if not image_url:
                    print("Görsel URL'si bulunamadı, atlanıyor...")
                    fail_count += 1
                    continue
                
                # Görseli indir
                if self.download_image(image_url, local_image_path):
                    success_count += 1
                else:
                    fail_count += 1
                
                # Rate limiting - sitede yoğunluk yaratmamak için
                time.sleep(2)
            
            print(f"\n=== ÖZET ===")
            print(f"Başarılı: {success_count}")
            print(f"Başarısız: {fail_count}")
            print(f"Toplam: {len(products)}")
            
        except Exception as e:
            print(f"JSON dosyası işlenirken hata: {e}")

def main():
    if len(sys.argv) != 2:
        print("Kullanım: python image_downloader.py <json_dosya_adı>")
        print("Örnek: python image_downloader.py koltuklar.json")
        return
    
    json_file = sys.argv[1]
    
    if not os.path.exists(json_file):
        print(f"Hata: {json_file} dosyası bulunamadı!")
        return
    
    print("IKEA Görsel İndirici Başlatılıyor...")
    print(f"İşlenecek dosya: {json_file}")
    print("-" * 50)
    
    downloader = IkeaImageDownloader()
    downloader.process_json_file(json_file)
    
    print("\nİşlem tamamlandı!")

if __name__ == "__main__":
    main()
