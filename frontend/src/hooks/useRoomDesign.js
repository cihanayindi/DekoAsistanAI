import { useState } from 'react';
import { validateForm, validateBlock, generateDesignSuggestion } from '../utils/roomDesignUtils';

/**
 * Oda tasarımı hook'u - Ana business logic
 * @returns {Object} State ve handler fonksiyonları
 */
export const useRoomDesign = () => {
  const [form, setForm] = useState({
    roomType: 'salon',
    designStyle: 'modern',
    notes: '',
    width: '',
    length: '',
    height: '',
    extras: []
  });

  const [newBlock, setNewBlock] = useState({
    width: '', length: '', x: '', y: ''
  });

  const [result, setResult] = useState(null);

  // Form değişiklik handler'ı
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Çıkıntı form değişiklik handler'ı
  const handleExtraChange = (e) => {
    const { name, value } = e.target;
    setNewBlock(prev => ({ ...prev, [name]: value }));
  };

  // Çıkıntı ekleme
  const addBlock = () => {
    const roomDimensions = {
      width: parseInt(form.width) || 0,
      length: parseInt(form.length) || 0
    };

    const validation = validateBlock(newBlock, roomDimensions);
    
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    const blockToAdd = {
      ...newBlock,
      width: parseInt(newBlock.width),
      length: parseInt(newBlock.length),
      x: parseInt(newBlock.x) || 0,
      y: parseInt(newBlock.y) || 0
    };

    setForm(prev => ({
      ...prev,
      extras: [...prev.extras, blockToAdd]
    }));
    
    setNewBlock({ width: '', length: '', x: '', y: '' });
  };

  // Çıkıntı silme
  const removeBlock = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Form gönderme
  const handleSubmit = () => {
    const validation = validateForm(form);
    
    if (!validation.isValid) {
      const errorMessage = '⚠️ Eksik Bilgi!\n\nLütfen aşağıdaki alanları doldurun:\n• ' + 
        validation.errors.join('\n• ') + 
        '\n\n💡 Tüm bilgiler tasarım önerisi için gereklidir.';
      alert(errorMessage);
      return;
    }

    const designResult = generateDesignSuggestion(form);
    setResult(designResult);
  };

  return {
    // State
    form,
    newBlock,
    result,
    
    // Handlers
    handleChange,
    handleExtraChange,
    addBlock,
    removeBlock,
    handleSubmit
  };
};
