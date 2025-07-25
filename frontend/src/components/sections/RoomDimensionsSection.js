import React from 'react';
import Tooltip from '../common/Tooltip';
import RoomVisualization from '../common/RoomVisualization';
import ExtraBlock from '../common/ExtraBlock';

/**
 * Oda boyutları ve görselleştirme section'ı
 * @param {Object} form - Form state'i
 * @param {Function} handleChange - Form değişiklik handler'ı
 * @param {Object} newBlock - Yeni çıkıntı state'i
 * @param {Function} handleExtraChange - Çıkıntı değişiklik handler'ı
 * @param {Function} addBlock - Çıkıntı ekleme fonksiyonu
 * @param {Function} removeBlock - Çıkıntı silme fonksiyonu
 */
const RoomDimensionsSection = ({ 
  form, 
  handleChange, 
  newBlock, 
  handleExtraChange, 
  addBlock, 
  removeBlock 
}) => {
  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-lg space-y-3">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">📐 Oda Boyutları</h2>
        <Tooltip text="Odanızın temel boyutlarını girin ve görselleştirin">
          <span className="ml-2 text-blue-400 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      {/* Boyut girişleri */}
      <div className="space-y-2.5">
        <div className="relative">
          <Tooltip text="Odanın genişliği (sol-sağ) cm cinsinden">
            <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
              ↔️ Genişlik (cm)
            </label>
          </Tooltip>
          <input 
            name="width" 
            type="number" 
            placeholder="300" 
            className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 transition-colors" 
            onChange={handleChange} 
            value={form.width}
            min="1"
          />
        </div>
        <div className="relative">
          <Tooltip text="Odanın uzunluğu (yukarı-aşağı) cm cinsinden">
            <label className="block text-sm text-gray-300 mb-0.5 cursor-help">
              ↕️ Uzunluk (cm)
            </label>
          </Tooltip>
          <input 
            name="length" 
            type="number" 
            placeholder="400" 
            className="w-full p-1.5 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 transition-colors" 
            onChange={handleChange} 
            value={form.length}
            min="1"
          />
        </div>
      </div>

      {/* Oda Görselleştirme - kompakt */}
      <div className="bg-gray-700 p-2.5 rounded">
        <RoomVisualization 
          width={parseInt(form.width) || 0} 
          length={parseInt(form.length) || 0} 
          extras={form.extras} 
        />
      </div>

      {/* Çıkıntı Ekleme - kompakt */}
      <div className="bg-gray-700 p-2.5 rounded space-y-1.5">
        <div className="flex items-center">
          <h4 className="font-medium text-sm">📐 Çıkıntı Ekle</h4>
          <Tooltip text="Kolon, niş gibi sabit yapılar">
            <span className="ml-1 text-blue-400 cursor-help text-xs">ℹ️</span>
          </Tooltip>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5">
          <input 
            name="width" 
            type="number" 
            placeholder="Genişlik" 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.width} 
            onChange={handleExtraChange}
            min="1"
          />
          <input 
            name="length" 
            type="number" 
            placeholder="Uzunluk" 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.length} 
            onChange={handleExtraChange}
            min="1"
          />
          <input 
            name="x" 
            type="number" 
            placeholder="X Pos." 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.x} 
            onChange={handleExtraChange}
            min="0"
          />
          <input 
            name="y" 
            type="number" 
            placeholder="Y Pos." 
            className="p-1 bg-gray-800 rounded text-xs" 
            value={newBlock.y} 
            onChange={handleExtraChange}
            min="0"
          />
        </div>
        
        <button 
          onClick={addBlock} 
          className="w-full bg-purple-500 hover:bg-purple-600 px-1.5 py-0.5 rounded text-xs font-medium transition-colors"
        >
          ➕ Ekle
        </button>

        {/* Mevcut Çıkıntılar - kompakt liste */}
        {form.extras.length > 0 && (
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-300">📦 Çıkıntılar:</p>
            <div className="max-h-32 overflow-y-auto space-y-0.5">
              {form.extras.map((block, index) => (
                <ExtraBlock 
                  key={`block-${index}-${block.x}-${block.y}`} 
                  block={block} 
                  index={index} 
                  onRemove={removeBlock} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDimensionsSection;
