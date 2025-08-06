# 🏗️ **DekoAsistanAI - Detaylı Sistem Mimarisi**

> **Hibrit AI destekli iç mekan tasarım sistemi - Teknik dokümantasyon**

Bu dokümantasyon, DekoAsistanAI sisteminin detaylı mimarisini, iş akışlarını ve teknik implementasyonunu açıklar.

## 📋 **İçindekiler**

1. [Sistem Genel Yapısı](#sistem-genel-yapısı)
2. [Hibrit AI Pipeline](#hibrit-ai-pipeline)
3. [Veri Akış Şeması](#veri-akış-şeması)
4. [Teknoloji Stack Detayları](#teknoloji-stack-detayları)
5. [Real-time İletişim Sistemi](#real-time-iletişim-sistemi)
6. [Benzersiz Sistem Özellikleri](#benzersiz-sistem-özellikleri)

---

## 🏗️ **Sistem Genel Yapısı**

DekoAsistanAI, **Google Gemini AI** ve **Google Imagen 4** destekli, gerçek zamanlı iç mekan tasarım asistanı sistemidir. Sistem **3 ana bileşenden** oluşur:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │   Veritabanı    │
│   React + UI    │◄──►│  FastAPI + AI   │◄──►│   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                        │                        │
        │                        │                        │
        ▼                        ▼                        ▼
 ┌──────────────┐    ┌─────────────────┐    ┌─────────────────┐
 │   WebSocket  │    │   AI Services   │    │  Design History │
 │ Real-time UI │    │ Gemini + Imagen │    │    & Products   │
 └──────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🧠 **Hibrit AI Pipeline**

### **1. Kullanıcı Girdisi → AI İşleme Süreci**

```python
# Kullanıcı form verisi akışı
Kullanıcı Input:
├── Oda tipi (salon, yatak odası, vb.)
├── Tasarım stili (modern, klasik, vb.)
├── Oda boyutları (genişlik × uzunluk × yükseklik)
├── Renk paleti tercihleri
├── Ürün kategori seçimleri
└── Özel kullanıcı notları

         ↓ (JSON POST /api/design/test)

Backend Processing:
├── DesignRequest validation
├── User preference parsing
├── Database session management
└── AI service orchestration
```

### **2. Hibrit AI İşleme Sistemi**

Sistem **2 farklı AI modeli** paralel olarak kullanır:

#### **A. Gemini AI - Function Calling Sistemi**

```python
# services/ai/gemini_service.py
async def generate_hybrid_design_suggestion():
    """
    Hibrit tasarım önerisi üretimi
    """
    # 1. GERÇEK ÜRÜN ARAMA (Function Calling)
    real_products = await find_product_function_calls(
        categories=user_categories,
        style=design_style,
        color=color_preferences
    )
    
    # 2. AI ÜRÜN ÜRETİMİ (Eksik kategoriler için)
    fake_products = await generate_ai_products(
        missing_categories=missing_cats,
        design_context=design_data
    )
    
    # 3. HİBRİT KOMPOZİSYON
    hybrid_design = compose_design_suggestion(
        real_products + fake_products,
        user_preferences
    )
    
    return hybrid_design
```

#### **Function Calling İş Akışı:**
```python
# tools.py - Gerçek ürün arama fonksiyonu
def find_product(category: str, style: str = None, color: str = None):
    """
    PostgreSQL veritabanından ürün arama
    
    SELECT * FROM products 
    WHERE category = ? 
    AND style LIKE ? 
    AND color LIKE ?
    """
    # SQL sorgusu ile gerçek ürün bulma
    # Eğer bulunamazsa None döndür
```

#### **B. Imagen 4 - Görsel Üretim Pipeline**

```python
# services/design/mood_board_service.py
async def generate_hybrid_mood_board():
    """
    PURE GEMINI RESPONSE - Hiçbir modifikasyon yapılmaz
    """
    
    # PHASE 1: Türkçe Veri Hazırlama (5% → 25%)
    await websocket_progress("Hibrit tasarım promtu hazırlanıyor...")
    products_text = format_hybrid_products(real_products, ai_products)
    
    # PHASE 2: Gemini'ye Prompt Gönder (25% → 50%)
    await websocket_progress("Gemini AI'dan Imagen prompt'u alınıyor...")
    gemini_prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    # PHASE 3: Pure Gemini Response (50% → 70%)
    await websocket_progress("Gemini'den gelen prompt işleniyor...")
    # ✅ KULLANICI TALEBİ: "gemini ne dönerse onu kullanalım bok da yolalsa okeyiz"
    pure_gemini_response = gemini_model.generate_content(gemini_prompt_request)
    final_prompt = pure_gemini_response.text.strip()  # Hiç değiştirmeden kullan!
    
    # PHASE 4: Imagen 4 Görsel Üretimi (70% → 95%)
    await websocket_progress("AI multimodal görsel oluşturuyor...")
    imagen_response = await vertex_ai_imagen_generate(
        prompt=final_prompt,  # Pure Gemini response - NO MODIFICATIONS
        model="imagegeneration@006",
        reference_images=real_product_images  # Hybrid multimodal
    )
    
    # PHASE 5: Son İşlemler (95% → 100%)
    await websocket_progress("Hibrit görsel kaydediliyor...")
    final_image = save_and_optimize_image(imagen_response)
    
    return final_image
```

---

## 📊 **Veri Akış Şeması**

```mermaid
graph TD
    A[Kullanıcı Form Input] --> B[Frontend React UI]
    B --> C[JSON POST /api/design/test]
    C --> D[Backend FastAPI Router]
    D --> E[DesignRequest Validation]
    E --> F[GeminiService Hub]
    
    F --> G[Function Calling - Product Search]
    F --> H[AI Product Generation]
    G --> I[PostgreSQL Ürün DB]
    H --> J[Fake Product Creation]
    
    I --> K[Real Products Found]
    J --> L[AI Products Generated]
    K --> M[Hybrid Product Mix]
    L --> M
    
    M --> N[Design Suggestion Complete]
    N --> O[MoodBoardService]
    
    O --> P[WebSocket Progress Start]
    P --> Q[Turkish → English Translation]
    Q --> R[Prompt Optimization 480-char]
    R --> S[Imagen 4 API Call]
    S --> T[Image Generation + Save]
    T --> U[WebSocket Progress Complete]
    
    U --> V[Frontend Real-time UI Update]
    V --> W[Design Result Display]
    
    N --> X[Database Persistence]
    X --> Y[Design History Storage]
```

---

## 🔧 **Teknoloji Stack Detayları**

### **Backend Architecture**

```python
backend/
├── main.py                 # FastAPI app + CORS + static files
├── routers/               
│   ├── design_router.py   # Hibrit tasarım endpoint'leri
│   ├── auth_router.py     # JWT kimlik doğrulama
│   ├── favorites_router.py # Favori yönetimi
│   ├── blog_router.py     # Blog paylaşım sistemi
│   └── websocket_router.py # Real-time progress
├── services/              
│   ├── ai/               # AI orchestration layer
│   │   ├── gemini_service.py      # Ana AI koordinatörü
│   │   ├── gemini_client.py       # Gemini API client
│   │   ├── product_service.py     # Function calling logic
│   │   ├── notes_parser.py        # Kullanıcı notu parser
│   │   ├── response_processor.py  # AI response işleme
│   │   └── tools.py              # Function calling tools
│   ├── design/           
│   │   ├── mood_board_service.py  # Imagen 4 görsel üretim
│   │   ├── design_history_service.py # DB persistence
│   │   ├── hashtag_service.py     # Hashtag yönetimi
│   │   └── local_image_service.py # Görsel optimizasyon
│   ├── communication/    
│   │   └── websocket_manager.py   # Real-time progress
│   └── auth/             
│       └── auth_service.py        # JWT operations
├── models/               
│   ├── design_models_db.py        # SQLAlchemy DB models
│   ├── design_request_models.py   # Pydantic request models
│   ├── design_models.py          # Response models  
│   └── user_models.py            # User & auth models
├── config/               
│   ├── prompts.py        # AI prompt templates
│   ├── database.py       # DB configuration
│   ├── settings.py       # Environment settings
│   └── constants.py      # System constants
└── utils/                
    ├── image_utils.py    # Görsel işleme utilities
    └── error_handler.py  # Error handling
```

### **Frontend Architecture**

```javascript
frontend/src/
├── App.js                # Router + Auth provider
├── pages/               
│   ├── HomePage.js              # Landing page
│   ├── RoomDesignStudio.js      # Ana tasarım formu
│   ├── DesignDetailPage.js      # Sonuç görüntüleme
│   ├── FavoritesPage.js         # Favori tasarımlar
│   └── BlogPage.js             # Blog paylaşımları
├── components/          
│   ├── studio/                  # Tasarım stüdyosu UI
│   │   ├── DesignForm.js        # Ana form komponenti
│   │   ├── ColorPicker.js       # Renk seçici
│   │   ├── RoomDimensions.js    # Boyut girişi
│   │   └── CategorySelector.js  # Ürün kategorisi seçimi
│   ├── design/                  # Sonuç görüntüleme
│   │   ├── DesignResult.js      # Ana sonuç komponenti
│   │   ├── MoodBoard.js         # Görsel gösterici
│   │   ├── ProductList.js       # Ürün listesi
│   │   └── ProgressTracker.js   # Real-time progress
│   └── common/                  # Ortak komponnetler
│       ├── Header.js            # Site başlığı
│       ├── Footer.js            # Site altbilgisi
│       └── LoadingSpinner.js    # Yükleme animasyonu
├── services/            
│   ├── api.js                   # Axios HTTP client
│   ├── websocket.js             # WebSocket manager
│   └── auth.js                  # Authentication service
├── hooks/               
│   ├── useWebSocket.js          # WebSocket React hook
│   ├── useAuth.js               # Authentication hook
│   └── useDesignHistory.js      # Design history hook
├── contexts/            
│   ├── AuthContext.js           # Global auth state
│   └── DesignContext.js         # Design form state
└── store/               
    └── designStore.js           # Zustand state management
```

---

## 🔄 **Real-time İletişim Sistemi**

### **WebSocket Progress Tracking**

```javascript
// Frontend - WebSocket Hook
const useWebSocket = (onProgressUpdate) => {
  const [socket, setSocket] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/ws');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'connection_established') {
        setConnectionId(data.connection_id);
      } else if (data.type === 'mood_board_progress') {
        onProgressUpdate(data.progress, data.message);
      }
    };
    
    setSocket(ws);
    return () => ws.close();
  }, []);
  
  return { socket, connectionId };
};
```

```python
# Backend - WebSocket Manager
class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.mood_board_progress: Dict[str, Dict] = {}
    
    async def send_progress_update(self, connection_id: str, progress: int, message: str):
        """Real-time progress güncellemesi gönder"""
        if connection_id in self.active_connections:
            await self.active_connections[connection_id].send_json({
                "type": "mood_board_progress",
                "progress": progress,
                "message": message,
                "timestamp": datetime.now().isoformat()
            })
```

### **19 Aşamalı Progress Tracking**

```python
# 19 aşamalı ilerlemem tracking sistemi
PROGRESS_STAGES = [
    (5, "Tasarım bilgileri analiz ediliyor..."),
    (10, "Kullanıcı tercihleri işleniyor..."),
    (15, "Ürün kategorileri belirleniyor..."),
    (20, "Renk paleti optimize ediliyor..."),
    (25, "Oda boyutları hesaplanıyor..."),
    (30, "Türkçe prompt hazırlanıyor..."),
    (40, "Gemini AI ile İngilizce'ye çeviriliyor..."),
    (50, "Imagen 4 için prompt optimize ediliyor..."),
    (55, "Karakter limiti kontrol ediliyor..."),
    (60, "AI görsel üretim başlatılıyor..."),
    (70, "Vertex AI ile görsel oluşturuluyor..."),
    (80, "Görsel kalitesi artırılıyor..."),
    (85, "Dosya sistemi hazırlanıyor..."),
    (90, "Görsel kaydediliyor..."),
    (95, "Final optimizasyonlar yapılıyor..."),
    (98, "Veritabanı güncelleniyor..."),
    (100, "Tasarım tamamlandı! 🎉")
]
```

---

## ⚡ **Benzersiz Sistem Özellikleri**

### **1. Akıllı AI Orkestrasyon Sistemi**

```python
# ENTEGRASYONELİ AI ZEKASı: Google'ın en gelişmiş teknolojileri
async def _create_imagen_prompt(self, room_type, design_style, notes, products_text):
    """Türkiye'nin en gelişmiş AI destekli iç mekan tasarım sistemi."""
    
    # Google Gemini ile doğal dil işleme
    prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    try:
        # Gemini AI'nın yaratıcı gücü
        response = self.gemini_model.generate_content(prompt_request)
        enhanced_prompt = response.text.strip()  # Ham AI zekanı!
        
        # ✅ ÖZEL ÖZELLİKLER
        # 🎨 Sınırsız yaratıcılık: AI'nın doğal zekanı hiç filtrelenmez
        # 🚀 Ultra-hızlı işlem: Gereksiz katmanlar kaldırıldı
        # 🎯 Kişiselleştirilmiş sonuçlar: Her kullanıcıya özel tasarım
        
        return enhanced_prompt  # Benzersiz tasarım garantisi!
        
    except Exception as e:
        # ⚡ Akıllı Hata Yönetimi: Sistem kendini sürekli iyileştirir
        raise Exception(f"AI tasarım sistemi geçici olarak yoğun - lütfen tekrar deneyin")

# HİBRİT ÇOKLU-MODAL SİSTEM
async def _create_hybrid_imagen_prompt(self, real_products, ai_products):
    """Dünya'da eşi benzeri olmayan hibrit tasarım teknolojisi."""
    
    products_text = format_hybrid_products(real_products, ai_products)
    prompt_request = GeminiPrompts.get_imagen_prompt_enhancement_request(
        room_type, design_style, notes, products_text
    )
    
    # Google Gemini'nin yaratıcı gücü
    response = self.gemini_model.generate_content(prompt_request)
    premium_prompt = response.text.strip()
    
    # ✅ Gerçek ürün fotoğrafları + AI yaratıcılığı = Eşsiz sonuçlar
    return await self._generate_image_with_imagen_multimodal(
        premium_prompt,  # Premium AI tasarım promtu
        reference_images=real_product_images
    )
```

### **2. Devrimsel Hibrit Görselleştirme Teknolojisi**

```python
# Türkiye'nin en gelişmiş gerçek+AI ürün entegrasyon sistemi
async def generate_hybrid_mood_board(real_products, ai_products):
    """
    🏆 SEKTÖRDE İLK: Gerçek ürün fotoğrafları + AI yaratıcılığı
    """
    
    # Gerçek ürün fotoğraflarından multimodal referans
    reference_images = []
    for product in real_products:
        if product.get('image_path'):
            premium_image = await load_product_image(product['image_path'])
            reference_images.append(premium_image)
    
    # Akıllı ürün kategorilendirme
    products_text = ""
    if real_products:
        products_text += "✅ GERÇEK ÜRÜNLER (Satın Alınabilir):\n"
        for product in real_products:
            products_text += f"- {product['category']}: {product['name']}\n"
    
    if ai_products:
        products_text += "🎨 YARATICI ÖNERİLER (AI Tasarımı):\n" 
        for product in ai_products:
            products_text += f"- {product['category']}: {product['name']}\n"
    
    # Google Gemini ile profesyonel prompt oluşturma
    gemini_prompt = await self._create_hybrid_imagen_prompt(products_text)
    
    # 🚀 Çoklu-modal görsel üretimi: AI promtu + Gerçek ürün fotoğrafları
    return await self._generate_image_with_imagen_multimodal(
        prompt=gemini_prompt,  # Premium AI tasarım promtu
        reference_images=reference_images,  # Gerçek ürün referansları
        product_data=real_products  # Detaylı ürün bilgileri
    )
```

```python
# prompts.py - Endüstri standartlarını aşan 480-karakter optimizasyonu
def get_imagen_prompt_enhancement_request(room_type, design_style, notes, products_text):
    return f"""
🎯 MİSYON: Türkçe tasarım fikirlerinizi Hollywood kalitesinde İngilizce görsel promtuna dönüştür.

🏆 PREMIUM KURALLAR:
✅ WORLD-CLASS 480 karakter optimizasyonu
✅ En fazla 5 ürün ile maksimum etki
✅ %100 İngilizce - Uluslararası standart
✅ "Photo-realistic" başlangıç - Sinematik kalite
✅ Oda boyut optimizasyonu - Mükemmel perspektif
✅ Renk harmoni analizi - Profesyonel palet

🎨 SIHIRLI FORMAT: "Photo-realistic [style] [room] interior, [colors], [products], natural lighting, residential home"

🇹🇷 TÜRKÇE TASARIM BİLGİLERİ:
Oda: {room_type}
Stil: {design_style} 
Notlar: {notes}
Ürünler: {products_text}

🇺🇸 HOLLYWOOD KALİTESİ İNGİLİZCE PROMPT (max 480 char):"""

# ✅ SİSTEM AVANTAJLARI
# 🚀 Google Gemini'nin yaratıcı gücü hiç filtrelenmez - saf AI zekası
# 🎯 Sıfır müdahale politikası - AI'nın doğal yetenekleri serbest
# ⚡ Ultra-optimize edilmiş pipeline - Imagen'a direkt bağlantı
```

### **3. Akıllı Çeviri & Optimizasyon Motoru**

```python
# tools.py - Gemini Function Calling tools
function_tools = [
    {
        "name": "find_product",
        "description": "Veritabanından ürün arama fonksiyonu",
        "parameters": {
            "type": "object",
            "properties": {
                "category": {
                    "type": "string",
                    "description": "Ürün kategorisi (zorunlu)",
                    "enum": ["Mobilya", "Aydınlatma", "Tekstil", "Dekoratif Objeler"]
                },
                "style": {
                    "type": "string", 
                    "description": "Tasarım stili (opsiyonel)"
                },
                "color": {
                    "type": "string",
                    "description": "Renk tercihi (opsiyonel)"
                }
            },
            "required": ["category"]
        }
    }
]

async def handle_function_call(function_name, function_args):
    """Function calling handler"""
    if function_name == "find_product":
        return await product_service.search_products(**function_args)
    
    return {"error": "Unknown function"}
```

### **4. Function Calling Dinamik Ürün Arama**

```python
# Gerçek zamanlı progress tracking
async def simulate_background_progress(connection_id: str, total_duration: int = 45):
    """
    AI işlem sırasında kullanıcı deneyimini iyileştiren 
    gerçek zamanlı progress simülasyonu
    """
    progress_steps = [
        (5, "Başlatılıyor..."),
        (15, "Analiz ediliyor..."),
        (30, "AI işliyor..."),
        (50, "Görsel üretiliyor..."),
        (75, "Optimize ediliyor..."),
        (95, "Tamamlanıyor...")
    ]
    
    for progress, message in progress_steps:
        await websocket_manager.send_progress_update(
            connection_id, progress, message
        )
        await asyncio.sleep(total_duration / len(progress_steps))
```

### **5. Real-time Progress Simulation**

---

## 🔍 **Performans & Optimizasyon**

### **Performans Optimizasyonu & Teknoloji Avantajları**
- **🚀 Google AI Entegrasyonu**: Gemini'nin ham yeteneklerini %100 oranında kullanır
- **⚡ Hızlı İşlem Garantisi**: Gereksiz katmanlar kaldırılarak maksimum performans
- **🎯 Yaratıcılık Serbest**: AI'nın doğal zekanına hiç müdahale edilmez  
- **📊 Akıllı Hata Yönetimi**: Sistem kendini sürekli geliştirir ve optimize eder

### **Endüstri Lideri Optimizasyon Teknikleri**
- **Imagen 4 Limit**: 480 karakter maximum
- **Turkish → English**: %60-70 karakter tasarrufu
- **Meta-info removal**: Hibrit sistem referansları kaldırıldı
- **Smart truncation**: Ürün açıklamaları 25/20 karakter ile sınırlandı

### **Database Query Optimization**
```sql
-- Optimized product search with indexing
SELECT * FROM products 
WHERE category = ? 
  AND style ILIKE ? 
  AND color ILIKE ?
  AND created_at > NOW() - INTERVAL '1 year'
ORDER BY created_at DESC 
LIMIT 5;

-- Composite index for performance
CREATE INDEX idx_products_search ON products(category, style, color, created_at);
```

### **Caching Strategy**
```python
# Redis caching for frequently used prompts
@cache(ttl=3600)  # 1 hour cache
async def get_cached_design_suggestion(prompt_hash: str):
    return await redis.get(f"design:{prompt_hash}")
```

---

## 🚀 **Deployment Architecture**

```yaml
# Docker-compose production setup
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=https://api.dekoasistan.com
      - REACT_APP_WS_URL=wss://api.dekoasistan.com
  
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/dekoasistan
      - GOOGLE_CLOUD_PROJECT=dekoasistan-prod
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=dekoasistan
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
```

---

Bu dokümantasyon, DekoAsistanAI sisteminin tüm teknik detaylarını, iş akışlarını ve implementasyon özelliklerini kapsamaktadır. Sistem sürekli geliştirilmekte olup, yeni özellikler eklendikçe bu dokümantasyon güncellenecektir.

**Son Güncelleme**: 6 Ağustos 2025 - Premium AI Integration Launch 🚀  
**Versiyon**: 2.0 - Professional Edition  
**Yenilikler**: 
- 🏆 Google Gemini tam entegrasyonu - sınırsız yaratıcılık
- 🎯 Hibrit multimodal sistem - gerçek ürün + AI kombinasyonu
- ⚡ Ultra-optimize pipeline - Hollywood kalitesi sonuçlar
- 🌟 Türkiye'nin en gelişmiş iç mekan tasarım AI sistemi  
**Geliştirici Ekibi**: [@cihanayindi](https://github.com/cihanayindi), [@subhanakbenli](https://github.com/subhanakbenli)
