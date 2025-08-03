#!/usr/bin/env python3
"""
IKEA Ürün Görseli Toplu İndirici

Bu script, jsonlaryeni dizinindeki tüm JSON dosyalarını işleyerek
IKEA ürün linklerinden görselleri indirip productsyeni/products/{kategori-adi}
klasörlerine kaydeder.

Kullanım:
    python batch_image_downloader.py
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
import glob

class BatchIkeaImageDownloader:
    def __init__(self, json_dir="jsonlaryeni", output_base_dir="productsyeni"):
        self.json_dir = json_dir
        self.output_base_dir = output_base_dir
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Toplam istatistikler
        self.total_success = 0
        self.total_fail = 0
        self.total_skipped = 0
    
    def extract_main_image_from_page(self, url):
        """IKEA ürün sayfasından ana görselin URL'sini çıkarır"""
        try:
            print(f"Sayfa indiriliyor: {url}")
            response = self.session.get(url, timeout=15)
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
    
    def get_category_folder_name(self, category_name):
        """Kategori adını dosya sistemi için uygun klasör adına çevirir"""
        # Türkçe karakterleri değiştir ve küçük harfe çevir
        replacements = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
        }
        
        folder_name = category_name.lower()
        for tr_char, en_char in replacements.items():
            folder_name = folder_name.replace(tr_char, en_char)
        
        # Boşlukları tire ile değiştir ve özel karakterleri kaldır
        folder_name = re.sub(r'[^\w\s-]', '', folder_name)
        folder_name = re.sub(r'[-\s]+', '-', folder_name).strip('-')
        
        return folder_name
    
    def generate_image_filename(self, product_name):
        """Ürün adından dosya adı oluşturur"""
        # Türkçe karakterleri değiştir
        replacements = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'c', 'Ğ': 'g', 'I': 'i', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
        }
        
        filename = product_name.lower()
        for tr_char, en_char in replacements.items():
            filename = filename.replace(tr_char, en_char)
        
        # Özel karakterleri kaldır, boşlukları tire ile değiştir
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename).strip('-')
        
        # Dosya adını kısalt (maksimum 100 karakter)
        if len(filename) > 100:
            filename = filename[:100]
        
        return f"{filename}.jpg"
    
    def process_single_json_file(self, json_file_path):
        """Tek bir JSON dosyasını işler"""
        try:
            # JSON dosyasını oku
            with open(json_file_path, 'r', encoding='utf-8') as f:
                products = json.load(f)
            
            json_filename = os.path.basename(json_file_path)
            category_from_filename = os.path.splitext(json_filename)[0]
            
            print(f"\n{'='*60}")
            print(f"İşleniyor: {json_filename}")
            print(f"Kategori: {category_from_filename}")
            print(f"Ürün sayısı: {len(products)}")
            print(f"{'='*60}")
            
            success_count = 0
            fail_count = 0
            skipped_count = 0
            
            for i, product in enumerate(products, 1):
                print(f"\n--- İşleniyor {i}/{len(products)} ---")
                product_name = product.get('product_name', 'Bilinmeyen')
                print(f"Ürün: {product_name}")
                
                product_link = product.get('product_link')
                category = product.get('category', category_from_filename)
                
                if not product_link:
                    print("Ürün linki bulunamadı, atlanıyor...")
                    fail_count += 1
                    continue
                
                # Kategori klasör adını oluştur
                category_folder = self.get_category_folder_name(category)
                
                # Görsel dosya adını oluştur
                image_filename = self.generate_image_filename(product_name)
                
                # Tam dosya yolunu oluştur
                image_dir = os.path.join(self.output_base_dir, "products", category_folder)
                image_path = os.path.join(image_dir, image_filename)
                
                print(f"Hedef yol: {image_path}")
                
                # Eğer dosya zaten varsa atla
                if os.path.exists(image_path):
                    print(f"Dosya zaten mevcut, atlanıyor: {image_path}")
                    skipped_count += 1
                    continue
                
                # Web sayfasından görsel URL'sini çıkar
                image_url = self.extract_main_image_from_page(product_link)
                
                if not image_url:
                    print("Görsel URL'si bulunamadı, atlanıyor...")
                    fail_count += 1
                    continue
                
                # Görseli indir
                if self.download_image(image_url, image_path):
                    success_count += 1
                else:
                    fail_count += 1
                
                # Rate limiting - sitede yoğunluk yaratmamak için
                time.sleep(3)  # Biraz daha yavaş olalım
            
            print(f"\n--- {json_filename} ÖZET ---")
            print(f"Başarılı: {success_count}")
            print(f"Başarısız: {fail_count}")
            print(f"Atlandı: {skipped_count}")
            print(f"Toplam: {len(products)}")
            
            # Global istatistiklere ekle
            self.total_success += success_count
            self.total_fail += fail_count
            self.total_skipped += skipped_count
            
            return success_count, fail_count, skipped_count
            
        except Exception as e:
            print(f"JSON dosyası işlenirken hata ({json_file_path}): {e}")
            return 0, 0, 0
    
    def process_all_json_files(self):
        """jsonlaryeni dizinindeki seçili JSON dosyalarını işler"""
        try:
            # Seçili JSON dosyaları listesi
            selected_files = [
                
                "tezgah.json"
            ]
            
            # Seçili dosyaların tam yollarını oluştur
            json_files = []
            for filename in selected_files:
                file_path = os.path.join(self.json_dir, filename)
                if os.path.exists(file_path):
                    json_files.append(file_path)
                else:
                    print(f"Uyarı: {filename} dosyası bulunamadı, atlanıyor...")
            
            if not json_files:
                print(f"Hata: Seçili JSON dosyalarından hiçbiri {self.json_dir} dizininde bulunamadı!")
                return
            
            print(f"İşlenecek seçili JSON dosyaları: {len(json_files)}")
            for json_file in json_files:
                print(f"  - {os.path.basename(json_file)}")
            
            print(f"\n{'#'*80}")
            print("SEÇİLİ DOSYALAR İÇİN GÖRSEL İNDİRME İŞLEMİ BAŞLATILUYOR")
            print(f"{'#'*80}")
            
            # Her JSON dosyasını işle
            for json_file in json_files:
                self.process_single_json_file(json_file)
                print(f"\n{'-'*40}")
                print("Sonraki dosyaya geçiliyor...")
                time.sleep(1)  # Dosyalar arası kısa bekleme
            
            # Genel özet
            print(f"\n{'#'*80}")
            print("SEÇİLİ DOSYALAR İÇİN GENEL ÖZET")
            print(f"{'#'*80}")
            print(f"İşlenen seçili JSON dosyası: {len(json_files)}")
            print(f"Toplam başarılı indirme: {self.total_success}")
            print(f"Toplam başarısız indirme: {self.total_fail}")
            print(f"Toplam atlanan dosya: {self.total_skipped}")
            print(f"Genel toplam: {self.total_success + self.total_fail + self.total_skipped}")
            print(f"{'#'*80}")
            
        except Exception as e:
            print(f"Toplu işlem sırasında hata: {e}")

def main():
    print("IKEA Seçili Dosyalar İçin Görsel İndirici Başlatılıyor...")
    print("-" * 50)
    
    # Çalışma dizinini kontrol et
    json_dir = "jsonlaryeni"
    output_dir = "productsyeni"
    
    if not os.path.exists(json_dir):
        print(f"Hata: {json_dir} dizini bulunamadı!")
        print("Bu scripti 'backend/data' dizininde çalıştırdığınızdan emin olun.")
        return
    
    # Çıktı dizinini oluştur
    os.makedirs(output_dir, exist_ok=True)
    
    downloader = BatchIkeaImageDownloader(json_dir, output_dir)
    downloader.process_all_json_files()
    
    print("\nSeçili dosyalar için işlemler tamamlandı!")

if __name__ == "__main__":
    main()
