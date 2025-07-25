import React from 'react';
import Tooltip from './Tooltip';

/**
 * Çıkıntı kartı bileşeni - Kompakt tasarım
 * @param {Object} block - Çıkıntı bilgileri {width, length, x, y}
 * @param {number} index - Çıkıntının indeks numarası
 * @param {Function} onRemove - Çıkıntı silme fonksiyonu (opsiyonel)
 */
const ExtraBlock = ({ block, index, onRemove }) => (
  <div className="p-2 bg-gray-700 rounded text-white text-xs mb-1 flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <span className="font-medium">🔹 {index + 1}.</span>
      <span className="text-gray-300">
        {block.width}×{block.length}cm ({block.x},{block.y})
      </span>
    </div>
    {onRemove && (
      <Tooltip text="Bu çıkıntıyı sil">
        <button 
          onClick={() => onRemove(index)} 
          className="bg-red-500 hover:bg-red-600 px-1 py-0.5 rounded text-xs transition-colors"
        >
          ❌
        </button>
      </Tooltip>
    )}
  </div>
);

export default ExtraBlock;
