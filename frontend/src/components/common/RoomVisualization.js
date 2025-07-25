import React from 'react';
import Tooltip from './Tooltip';

/**
 * Oda görselleştirme bileşeni - Kompakt 2D görünüm
 * @param {number} width - Oda genişliği (cm)
 * @param {number} length - Oda uzunluğu (cm)
 * @param {Array} extras - Çıkıntılar listesi
 */
const RoomVisualization = ({ width, length, extras }) => {
  if (!width || !length) {
    return (
      <div className="text-center text-gray-400 py-4">
        <p className="text-sm">🏠 Oda Görselleştirme</p>
        <p className="text-xs mt-1">Boyutları girin</p>
      </div>
    );
  }

  // Ölçeklendirme faktörü (250px maksimum boyut için - daha kompakt)
  const maxSize = 250;
  const scale = Math.min(maxSize / Math.max(width, length), 1);
  const scaledWidth = width * scale;
  const scaledLength = length * scale;

  return (
    <div>
      <div className="flex items-center justify-center mb-2">
        <h4 className="text-sm font-medium">🏠 Oda Görünümü</h4>
        <Tooltip text="Odanızın yukarıdan görünümü. Kırmızı alanlar çıkıntılar.">
          <span className="ml-1 text-blue-400 cursor-help text-xs">ℹ️</span>
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <div className="relative border-2 border-white bg-gray-600" 
             style={{ width: scaledWidth, height: scaledLength }}>
          
          {/* Boyut etiketleri - kompakt */}
          <Tooltip text="Genişlik">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-300 cursor-help">
              {width}cm
            </div>
          </Tooltip>
          <Tooltip text="Uzunluk">
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-gray-300 cursor-help">
              {length}cm
            </div>
          </Tooltip>

          {/* Koordinat başlangıcı */}
          <div className="absolute -top-3 -left-3 text-xs text-gray-400">
            <Tooltip text="Başlangıç noktası">
              <span className="cursor-help">📍</span>
            </Tooltip>
          </div>

          {/* Çıkıntılar */}
          {extras.map((block, index) => {
            const blockWidth = (block.width || 0) * scale;
            const blockLength = (block.length || 0) * scale;
            const blockX = (block.x || 0) * scale;
            const blockY = (block.y || 0) * scale;

            if (blockX + blockWidth > scaledWidth || blockY + blockLength > scaledLength) {
              return null;
            }

            return (
              <Tooltip 
                key={`visual-block-${index}-${block.x}-${block.y}`}
                text={`${index + 1}. Çıkıntı: ${block.width}×${block.length}cm`}
              >
                <div
                  className="absolute bg-red-400 border border-red-500 opacity-80 cursor-help hover:opacity-100 transition-opacity"
                  style={{
                    left: blockX,
                    top: blockY,
                    width: blockWidth,
                    height: blockLength,
                  }}
                >
                  <div className="text-xs text-white p-0.5 leading-none font-bold">
                    {index + 1}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        🔴 Çıkıntılar | 📐 (0,0) sol üst
      </p>
    </div>
  );
};

export default RoomVisualization;
