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
    if (formData.width && formData.length) {
      notes.push(`Oda Boyutları: ${formData.width}m x ${formData.length}m`);
    }
    
    if (formData.height) {
      notes.push(`Tavan Yüksekliği: ${formData.height}m`);
    }

    // Ekstra alanlar (çıkıntılar)
    if (formData.extras && formData.extras.length > 0) {
      notes.push(`Ekstra Alanlar:`);
      formData.extras.forEach((extra, index) => {
        notes.push(`  ${index + 1}. ${extra.width}m x ${extra.length}m (Konum: x:${extra.x}, y:${extra.y})`);
      });
    }

    // Kullanıcı notları
    if (formData.notes?.trim()) {
      notes.push(`Kullanıcı Notları: ${formData.notes}`);
    }

    return notes.join('\n');
  }
}
