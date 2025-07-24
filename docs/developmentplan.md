# **DekoAsistan.AI \- 2 Haftalık Geliştirme Planı**

* **Başlangıç:** 23 Temmuz 2025, 19:00  
* **Bitiş:** 6 Ağustos 2025, 19:00  
* **Ekip:** 2 Geliştirici \+ AI Asistanlar (GitHub Copilot, Gemini vb.)

### **Hafta 1: Temel Atma ve Çekirdek Fonksiyonların Geliştirilmesi (23 Temmuz \- 30 Temmuz)**

Bu haftanın ana hedefi, projenin iskeletini kurmak, backend ve frontend'in temel yapılarını oluşturmak ve AI servislerinin çekirdek mantığını entegre etmektir.

#### **🚀 Gün 1-2: Kurulum ve Altyapı (23-24 Temmuz)**

* **Görevler:**  
  * \[ \] GitHub repository oluşturma, main ve develop branch'lerini açma.  
  * \[ \] **Backend (Geliştirici 1):** FastAPI projesini başlatma, temel dosya yapısını (main.py, routers/, services/) oluşturma.  
  * \[ \] **Frontend (Geliştirici 2):** React (Vite) projesini başlatma, temel dosya yapısını (components/, pages/) oluşturma ve Tailwind CSS'i entegre etme.  
  * \[ \] **Backend (Geliştirici 1):** .env dosyası ile API anahtarlarını güvenli bir şekilde yönetme altyapısını kurma.  
  * \[ \] **Ortak Görev:** products.json dosyasını oluşturma (15-20 örnek ürünle başlangıç).

#### **🧠 Gün 3-4: Backend Çekirdek Mantığı ve Frontend Arayüzü (25-26 Temmuz)**

* **Görevler (Backend \- Geliştirici 1):**  
  * \[ \] /api/tasarim endpoint'ini oluşturma.  
  * \[ \] multipart/form-data ile metin ve resim dosyasını alacak Pydantic modellerini tanımlama.  
  * \[ \] Gemini API'ye metin ve görsel prompt gönderecek temel servis fonksiyonunu yazma.  
  * \[ \] Imagen API'ye prompt gönderip görsel üretecek temel servis fonksiyonunu yazma.  
* **Görevler (Frontend \- Geliştirici 2):**  
  * \[ \] AI asistanlarla temel UI bileşenlerini (Form, dosya yükleme, buton, sonuç kartları) oluşturma.  
  * \[ \] Ana sayfanın statik tasarımını (veri göndermeden) Tailwind CSS ile tamamlama.

#### **🔗 Gün 5-7: Function Calling ve Entegrasyon Hazırlığı (27-29 Temmuz)**

* **Görevler (Backend \- Geliştirici 1):**  
  * \[ \] **Function Calling:** urun\_bul fonksiyonunu tanımlama (products.json içinde arama yapacak).  
  * \[ \] Gemini API isteğine bu fonksiyon tanımını ekleme ve konuşma geçmişini yönetme (in-memory dictionary yöntemi).  
  * \[ \] Tüm AI mantığını tek bir servis/class altında birleştirerek temiz bir yapı oluşturma.  
* **Görevler (Frontend \- Geliştirici 2):**  
  * \[ \] axios kullanarak backend'e API isteği atma mantığını kurma.  
  * \[ \] Yükleme (loading) ve hata (error) durumlarını yönetecek state'leri ekleme.  
  * \[ \] Sonuçların (metin, resim, ürün linki) gösterileceği alanları dinamik hale getirme.

#### **✅ Hafta 1 Sonu Değerlendirmesi (30 Temmuz Akşamı)**

* **Hedef:** Backend ve Frontend'in temel entegrasyonu tamamlanmış olmalı. Frontend'den gönderilen bir istek, backend'de işlenip (henüz tam olmasa da) bir cevap döndürebilmeli.

### **Hafta 2: Entegrasyon, İyileştirme ve Teslimat (31 Temmuz \- 6 Ağustos)**

Bu haftanın ana hedefi, projeyi uçtan uca çalışır hale getirmek, kullanıcı deneyimini iyileştirmek, canlıya almak ve sunuma hazırlanmaktır.

#### **🤝 Gün 8-9: Uçtan Uca Entegrasyon ve Test (31 Temmuz \- 1 Ağustos)**

* **Görevler (Ortak Çalışma):**  
  * \[ \] Frontend ve Backend'i tam olarak birbirine bağlama.  
  * \[ \] Kullanıcının girdiği verilerin backend'e doğru ulaştığından ve AI servislerine doğru iletildiğinden emin olma.  
  * \[ \] Backend'den dönen (tasarım metni, mood board URL'i, ürün bilgisi) verilerin frontend'de doğru şekilde gösterilmesi.  
  * \[ \] İlk uçtan uca MVP testini gerçekleştirme ve çıkan hataları (bug) çözme.

#### **✨ Gün 10-11: İyileştirme ve "Should-Have" Özellikler (2-3 Ağustos)**

* **Görevler:**  
  * \[ \] **UI/UX (Geliştirici 2):** Arayüzde küçük iyileştirmeler yapma (geçişler, animasyonlar, mobil uyumluluk).  
  * \[ \] **Prompt Engineering (Geliştirici 1):** Gemini ve Imagen'den daha tutarlı ve kaliteli sonuçlar almak için prompt'ları iyileştirme.  
  * \[ \] **Hata Yönetimi (Ortak):** API'den hata dönerse kullanıcıya anlamlı bir mesaj gösterme.  
  * \[ \] **F2.1:** "Yeniden Dene" butonunu ekleme.  
  * \[ \] **F2.2:** "Panoya Kopyala" butonunu ekleme.

#### **🚀 Gün 12-13: Deployment ve Son Testler (4-5 Ağustos)**

* **Görevler:**  
  * \[ \] **Backend Deployment (Geliştirici 1):** Projeyi DigitalOcean VDS'e deploy etme (Nginx \+ Gunicorn konfigürasyonu).  
  * \[ \] **Frontend Deployment (Geliştirici 2):** Projeyi Vercel'e deploy etme ve backend API adresini doğru şekilde ayarlama.  
  * \[ \] **Test (Ortak):** Canlı ortamda kapsamlı testler yapma (farklı tarayıcılar, mobil cihazlar). Olası CORS hatalarını çözme.

#### **🏆 Gün 14: Sunum Hazırlığı ve TESLİM\! (6 Ağustos, 19:00'a kadar)**

* **Görevler (Ortak):**  
  * \[ \] GitHub repository'sini temizleme, README.md dosyasını PRD ve plan doğrultusunda güncelleme.  
  * \[ \] 7 dakikalık jüri sunumunu planlama (kim ne anlatacak, demo akışı nasıl olacak).  
  * \[ \] Proje teslim formunu doldurmak için gerekli materyalleri (GitHub linki, canlı link, 1 dakikalık video) hazırlama.  
  * \[ \] Son bir kez canlı sistemi kontrol etme.  
  * \[ \] **PROJEYİ TESLİM ETME\!** 🎉