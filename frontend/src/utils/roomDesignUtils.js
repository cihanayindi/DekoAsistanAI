/**
 * Oda tasarımı validasyon utility'leri
 */

/**
 * Form validasyonu
 * @param {Object} form - Form verisi
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
export const validateForm = (form) => {
  const errors = [];
  
  if (!form.width) errors.push('Oda genişliği gerekli');
  if (!form.length) errors.push('Oda uzunluğu gerekli');
  if (!form.height) errors.push('Oda yüksekliği gerekli');
  if (!form.notes?.trim()) errors.push('Tasarım notları gerekli');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Çıkıntı validasyonu
 * @param {Object} block - Çıkıntı verisi
 * @param {Object} roomDimensions - Oda boyutları {width, length}
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateBlock = (block, roomDimensions) => {
  const { width, length, x = 0, y = 0 } = block;
  const { width: roomWidth, length: roomLength } = roomDimensions;
  
  if (!width || !length) {
    return {
      isValid: false,
      error: '❌ Lütfen çıkıntının genişlik ve uzunluk değerlerini girin.\n\n💡 İpucu: Bu değerler zorunludur.'
    };
  }
  
  const blockWidth = parseInt(width);
  const blockLength = parseInt(length);
  const blockX = parseInt(x) || 0;
  const blockY = parseInt(y) || 0;
  
  if (roomWidth > 0 && roomLength > 0) {
    if (blockX + blockWidth > roomWidth) {
      return {
        isValid: false,
        error: `❌ Çıkıntı oda sınırlarını aşıyor!\n\n🔍 Problem: Çıkıntı oda genişliğini aşıyor\n📐 Hesaplama: ${blockX} (X pozisyonu) + ${blockWidth} (genişlik) = ${blockX + blockWidth}cm\n🏠 Oda genişliği: ${roomWidth}cm\n\n💡 Çözüm: X pozisyonunu küçültün veya çıkıntı genişliğini azaltın.`
      };
    }
    
    if (blockY + blockLength > roomLength) {
      return {
        isValid: false,
        error: `❌ Çıkıntı oda sınırlarını aşıyor!\n\n🔍 Problem: Çıkıntı oda uzunluğunu aşıyor\n📐 Hesaplama: ${blockY} (Y pozisyonu) + ${blockLength} (uzunluk) = ${blockY + blockLength}cm\n🏠 Oda uzunluğu: ${roomLength}cm\n\n💡 Çözüm: Y pozisyonunu küçültün veya çıkıntı uzunluğunu azaltın.`
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Tasarım önerisi oluşturucu
 * @param {Object} form - Form verisi
 * @returns {Object} Tasarım önerisi
 */
export const generateDesignSuggestion = (form) => {
  return {
    suggestion: `${form.designStyle} tarzında ${form.roomType} için öneriler hazır!`,
    extras: form.extras,
    dimensions: `${form.width} × ${form.length} × ${form.height} cm`
  };
};
