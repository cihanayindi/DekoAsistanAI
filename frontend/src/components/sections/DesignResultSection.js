import React from 'react';
import ExtraBlock from '../common/ExtraBlock';

/**
 * Tasarım önerisi sonuç section'ı
 * @param {Object} result - Tasarım sonucu verisi
 */
const DesignResultSection = ({ result }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
      <h2 className="text-lg font-semibold mb-3">🎨 Tasarım Önerisi</h2>
      {result ? (
        <div className="space-y-3">
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm"><strong>🧱 Boyutlar:</strong></p>
            <p className="text-xs text-gray-300">{result.dimensions}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm"><strong>💡 Öneri:</strong></p>
            <p className="text-xs text-gray-300">{result.suggestion}</p>
          </div>
          {result.extras.length > 0 && (
            <div className="bg-gray-700 p-3 rounded">
              <p className="text-sm font-medium mb-2">📦 Çıkıntılar:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {result.extras.map((b, i) => (
                  <ExtraBlock 
                    key={`result-block-${i}-${b.x}-${b.y}`} 
                    block={b} 
                    index={i} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          <p className="text-sm">Henüz bir tasarım oluşturulmadı.</p>
          <p className="text-xs mt-2">👈 Sol taraftan bilgileri doldurun</p>
        </div>
      )}
    </div>
  );
};

export default DesignResultSection;
