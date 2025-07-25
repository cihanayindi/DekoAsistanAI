import React from 'react';
import Tooltip from '../common/Tooltip';

/**
 * Oda bilgileri section'ı
 * @param {Object} form - Form state'i
 * @param {Function} handleChange - Form değişiklik handler'ı
 * @param {Function} handleSubmit - Form gönderme handler'ı
 * @param {boolean} isLoading - Yükleme durumu
 */
const RoomInfoSection = ({ form, handleChange, handleSubmit, isLoading }) => {
  const isFormValid = form.width && form.length && form.height && form.notes.trim();

  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">🏠 Oda Bilgileri</h2>
        <Tooltip text="Odanızın özelliklerini tanımlayın">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      <div>
        <Tooltip text="Tasarlayacağınız odanın türünü seçin">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            🏠 Oda Türü
          </label>
        </Tooltip>
        <select 
          name="roomType" 
          value={form.roomType} 
          onChange={handleChange} 
          className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
        >
          <option value="salon">🛋️ Salon</option>
          <option value="yatak">🛏️ Yatak Odası</option>
          <option value="çocuk">🧸 Çocuk Odası</option>
        </select>
      </div>

      <div>
        <Tooltip text="Odanızın tasarım stilini belirleyin">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            🎨 Tasarım Tarzı
          </label>
        </Tooltip>
        <select 
          name="designStyle" 
          value={form.designStyle} 
          onChange={handleChange} 
          className="w-full p-1.5 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 transition-colors"
        >
          <option value="modern">✨ Modern</option>
          <option value="minimal">🎯 Minimal</option>
          <option value="klasik">🏛️ Klasik</option>
        </select>
      </div>

      <div>
        <Tooltip text="Odanın yüksekliği (zemin-tavan) cm cinsinden">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            ⬆️ Yükseklik (cm)
          </label>
        </Tooltip>
        <input 
          name="height" 
          type="number" 
          placeholder="250" 
          className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 transition-colors" 
          onChange={handleChange} 
          value={form.height}
          min="1"
        />
      </div>

      <div>
        <Tooltip text="Özel isteklerinizi, renk tercihlerinizi veya önemli noktaları yazın">
          <label className="block text-sm text-gray-300 mb-1.5 cursor-help">
            📝 Tasarım Notları
          </label>
        </Tooltip>
        <textarea 
          name="notes" 
          rows={6} 
          placeholder="Örnek: Açık renkler, doğal ışık, çocuk güvenliği..." 
          className="w-full p-1.5 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 transition-colors resize-none" 
          value={form.notes} 
          onChange={handleChange}
        />
      </div>

      {/* Buton section'ı - ortalı ve kompakt */}
      <div className="mt-2.5 pt-1.5 border-t border-gray-600">
        <Tooltip text="Tüm bilgileri doldurduktan sonra tasarım önerisi oluşturmak için tıklayın">
          <button 
            onClick={handleSubmit} 
            className="w-full bg-green-600 hover:bg-green-700 py-2 px-4 rounded-lg font-semibold text-base transition-colors flex items-center justify-center shadow-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">⏳</span>
                Gönderiliyor...
              </>
            ) : (
              <>
                <span className="mr-2">🎯</span>
                Tasarım Önerisi Oluştur
              </>
            )}
          </button>
        </Tooltip>
        
        {!isFormValid && (
          <p className="text-xs text-yellow-400 text-center mt-1">
            ⚠️ Lütfen tüm alanları doldurun
          </p>
        )}
      </div>
    </div>
  );
};

export default RoomInfoSection;
