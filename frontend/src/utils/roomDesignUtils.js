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
  
  // Boyut sınırları
  const MAX_HEIGHT = 2000; // 20m
  const MAX_WIDTH = 5000;  // 50m
  const MAX_LENGTH = 5000; // 50m
  
  if (!form.width) {
    errors.push('Oda genişliği gerekli');
  } else if (parseInt(form.width) > MAX_WIDTH) {
    errors.push(`Oda genişliği maksimum ${MAX_WIDTH}cm (50m) olmalıdır`);
  }
  
  if (!form.length) {
    errors.push('Oda uzunluğu gerekli');
  } else if (parseInt(form.length) > MAX_LENGTH) {
    errors.push(`Oda uzunluğu maksimum ${MAX_LENGTH}cm (50m) olmalıdır`);
  }
  
  if (!form.height) {
    errors.push('Oda yüksekliği gerekli');
  } else if (parseInt(form.height) > MAX_HEIGHT) {
    errors.push(`Oda yüksekliği maksimum ${MAX_HEIGHT}cm (20m) olmalıdır`);
  }
  
  if (!form.notes?.trim()) {
    errors.push('Tasarım notları gerekli');
  }
  
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
  
  // Boyut sınırları
  const MAX_WIDTH = 5000;  // 50m
  const MAX_LENGTH = 5000; // 50m
  
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
  
  // Çıkıntı boyut sınırları kontrolü
  if (blockWidth > MAX_WIDTH) {
    return {
      isValid: false,
      error: `❌ Çıkıntı genişliği çok büyük!\n\n📐 Girilen değer: ${blockWidth}cm\n🚫 Maksimum limit: ${MAX_WIDTH}cm (50m)\n\n💡 Çözüm: Daha küçük bir genişlik değeri girin.`
    };
  }
  
  if (blockLength > MAX_LENGTH) {
    return {
      isValid: false,
      error: `❌ Çıkıntı uzunluğu çok büyük!\n\n📐 Girilen değer: ${blockLength}cm\n🚫 Maksimum limit: ${MAX_LENGTH}cm (50m)\n\n💡 Çözüm: Daha küçük bir uzunluk değeri girin.`
    };
  }

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
