import React, { useState } from 'react';
import Button from '../common/Button';

const RoomBuilderTabs = ({ setRoomStructure, currentStructure }) => {
  const [activeTab, setActiveTab] = useState('standard');
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    setDimensions((prev) => ({ ...prev, [name]: numValue }));
  };

  const handleShapeSelect = (shape) => {
    setRoomStructure({ type: 'preset', shape, name: getShapeName(shape) });
  };

  const handleStandardRoom = () => {
    setRoomStructure({
      type: 'standard',
      dimensions,
      name: `${dimensions.width}x${dimensions.height} cm Dikdörtgen Oda`
    });
  };

  const handleCustomRoom = () => {
    setRoomStructure({
      type: 'custom',
      shape: 'rectangle-with-protrusion',
      dimensions,
      protrusions: [{ side: 'right', width: 50, depth: 100 }],
      name: 'Özel Tasarım Oda'
    });
  };

  const getShapeName = (shape) => {
    const names = {
      'L': 'L Şekilli Oda',
      'T': 'T Şekilli Oda',
      'U': 'U Şekilli Oda',
      'rectangle': 'Dikdörtgen Oda'
    };
    return names[shape] || 'Özel Oda';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Tab Buttons */}
      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'standard' && (
        <StandardTab 
          dimensions={dimensions}
          onDimensionChange={handleDimensionChange}
          onCreateRoom={handleStandardRoom}
        />
      )}

      {activeTab === 'preset' && (
        <PresetTab onShapeSelect={handleShapeSelect} />
      )}

      {activeTab === 'custom' && (
        <CustomTab onCreateRoom={handleCustomRoom} />
      )}

      {/* Current Selection Display */}
      {currentStructure && (
        <CurrentSelection currentStructure={currentStructure} />
      )}
    </div>
  );
};

// Tab Buttons Component
const TabButtons = ({ activeTab, setActiveTab }) => {
  const TabButton = ({ tabKey, children, isActive, onClick }) => (
    <button
      onClick={() => onClick(tabKey)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex space-x-2 mb-4">
      <TabButton tabKey="standard" isActive={activeTab === 'standard'} onClick={setActiveTab}>
        📐 Standart
      </TabButton>
      <TabButton tabKey="preset" isActive={activeTab === 'preset'} onClick={setActiveTab}>
        🏠 Hazır Şekiller
      </TabButton>
      <TabButton tabKey="custom" isActive={activeTab === 'custom'} onClick={setActiveTab}>
        ✏️ Özel Tasarım
      </TabButton>
    </div>
  );
};

// Standard Tab Component
const StandardTab = ({ dimensions, onDimensionChange, onCreateRoom }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Genişlik (cm)
        </label>
        <input
          type="number"
          name="width"
          value={dimensions.width}
          onChange={onDimensionChange}
          min="100"
          max="1000"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-300">
          Uzunluk (cm)
        </label>
        <input
          type="number"
          name="height"
          value={dimensions.height}
          onChange={onDimensionChange}
          min="100"
          max="1000"
          className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-purple-500 focus:outline-none text-white"
        />
      </div>
    </div>
    
    <div className="bg-gray-700 rounded-lg p-3 text-center">
      <div className="text-2xl mb-2">📏</div>
      <p className="text-sm text-gray-300">
        {dimensions.width} x {dimensions.height} cm
      </p>
      <p className="text-xs text-gray-400">
        Alan: {(dimensions.width * dimensions.height / 10000).toFixed(1)} m²
      </p>
    </div>

    <Button onClick={onCreateRoom} size="small" className="w-full">
      Dikdörtgen Oda Oluştur
    </Button>
  </div>
);

// Preset Tab Component
const PresetTab = ({ onShapeSelect }) => {
  const PresetCard = ({ shape, icon, name, description, onClick }) => (
    <div
      onClick={() => onClick(shape)}
      className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-purple-500 hover:bg-purple-900/10 transition-all duration-200 text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="text-sm font-semibold mb-1">{name}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <PresetCard
          shape="L"
          icon="📐"
          name="L Şekilli"
          description="Köşeli oda tasarımı"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="T"
          icon="✚"
          name="T Şekilli"
          description="Merkezi geçiş alanı"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="U"
          icon="🔄"
          name="U Şekilli"
          description="Üç taraflı açık alan"
          onClick={onShapeSelect}
        />
        <PresetCard
          shape="rectangle"
          icon="⬜"
          name="Klasik"
          description="Standart dikdörtgen"
          onClick={onShapeSelect}
        />
      </div>
    </div>
  );
};

// Custom Tab Component
const CustomTab = ({ onCreateRoom }) => (
  <div className="space-y-4">
    <div className="text-center p-6 bg-gray-700 rounded-lg">
      <div className="text-4xl mb-3">🎨</div>
      <h4 className="text-lg font-semibold mb-2">Özel Oda Tasarımı</h4>
      <p className="text-sm text-gray-400 mb-4">
        Çıkıntıları ve özel şekilleri olan oda tasarımı oluştur
      </p>
      
      <div className="bg-gray-800 rounded p-3 mb-4">
        <p className="text-xs text-gray-300">
          🏗️ Bu özellik: Sağ tarafta 50x100 cm çıkıntı ekler
        </p>
      </div>

      <Button onClick={onCreateRoom} size="small" className="w-full">
        Özel Oda Oluştur
      </Button>
    </div>
  </div>
);

// Current Selection Display Component
const CurrentSelection = ({ currentStructure }) => (
  <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500 rounded-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-purple-300">Seçili Oda Yapısı:</p>
        <p className="text-xs text-gray-300">{currentStructure.name}</p>
      </div>
      <div className="text-purple-400">✓</div>
    </div>
  </div>
);

export default RoomBuilderTabs;
