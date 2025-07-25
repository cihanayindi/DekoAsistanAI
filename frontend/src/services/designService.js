import { API_CONFIG } from '../config/api';

/**
 * Design service - Backend API ile iletişim
 */
export class DesignService {
  static async submitDesignRequest(formData) {
    try {
      // FormData oluştur
      const formDataObj = new FormData();
      
      // Form verilerini ekle
      formDataObj.append('oda_tipi', formData.roomType);
      formDataObj.append('tasarim_stili', formData.designStyle);
      
      // Notları ve oda boyutlarını birleştir
      const fullNotes = this.createFullNotes(formData);
      formDataObj.append('notlar', fullNotes);

      // API isteği gönder
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/test`, {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Design service error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Form verilerini tam notlar haline getirir
   */
  static createFullNotes(formData) {
    let notes = [];
    
    // Oda boyutları
    if (formData.width && formData.length && formData.height) {
      notes.push(`Oda Boyutları: ${formData.width}cm x ${formData.length}cm x ${formData.height}cm (G x U x Y)`);
    } else if (formData.width && formData.length) {
      notes.push(`Oda Boyutları: ${formData.width}cm x ${formData.length}cm (Genişlik x Uzunluk)`);
      if (formData.height) {
        notes.push(`Tavan Yüksekliği: ${formData.height}cm`);
      }
    }

    // Ekstra alanlar (çıkıntılar)
    if (formData.extras && formData.extras.length > 0) {
      notes.push(`Ekstra Alanlar:`);
      formData.extras.forEach((extra, index) => {
        notes.push(`  ${index + 1}. ${extra.width}cm x ${extra.length}cm (Konum: x:${extra.x}cm, y:${extra.y}cm)`);
      });
    }

    // Kullanıcı notları
    if (formData.notes?.trim()) {
      notes.push(`Kullanıcı Notları: ${formData.notes}`);
    }

    return notes.join('\n');
  }
}
