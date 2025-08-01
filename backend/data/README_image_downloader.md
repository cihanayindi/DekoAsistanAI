# IKEA Görsel İndirici

Bu Python scripti, JSON dosyasındaki IKEA ürün linklerinden görselleri otomatik olarak indirip belirtilen dosya yollarına kaydeder.

## Kurulum

1. Gerekli kütüphaneleri yükleyin:
```bash
pip install -r requirements_downloader.txt
```

## Kullanım

```bash
python image_downloader.py <json_dosya_adı>
```

### Örnek:
```bash
python image_downloader.py koltuklar.json
```

## JSON Dosya Formatı

JSON dosyası şu formatta olmalıdır:

```json
[
  {
    "product_name": "Ürün Adı",
    "image_path": "backend/data/products/sofas/urun-adi.jpg",
    "product_link": "https://www.ikea.com.tr/urun/urun-linki"
  }
]
```

## Özellikler

- ✅ Otomatik dizin oluşturma
- ✅ Mevcut dosyaları atlama
- ✅ Yüksek kaliteli görsel indirme (2000x2000)
- ✅ Rate limiting (site yoğunluğunu önlemek için)
- ✅ Detaylı ilerleme raporu
- ✅ Hata yönetimi

## Notlar

- Script, zaten mevcut olan dosyaları tekrar indirmez
- Her indirme arasında 2 saniye bekler (site politikaları)
- Büyük görselleri (2000x2000) indirir
- Hata durumunda devam eder ve özet rapor verir

## Sorun Giderme

Eğer bir ürünün görseli indirilemiyorsa:
1. Ürün linkinin doğru olduğundan emin olun
2. İnternet bağlantınızı kontrol edin
3. IKEA sitesinin erişilebilir olduğundan emin olun
