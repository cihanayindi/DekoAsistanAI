import React, { useState } from 'react';
import FormField from '../common/FormField';
import Button from '../common/Button';
import Card from '../common/Card';
import { formConfig } from '../../data/formConfig';
import { API_CONFIG } from '../../config/api';

const DemoSection = () => {
  const [formData, setFormData] = useState({
    roomType: 'salon',
    designStyle: 'modern',
    notes: '',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('Form submitted:', formData);
      
      // Backend'e gönderilecek form data'yı hazırla
      const formDataToSend = new FormData();
      formDataToSend.append('oda_tipi', formData.roomType);
      formDataToSend.append('tasarim_stili', formData.designStyle);
      formDataToSend.append('notlar', formData.notes);
      
      // Fotoğraf varsa ekle (şimdilik null olacak)
      if (formData.photo) {
        formDataToSend.append('oda_fotografi', formData.photo);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TEST}`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        alert('Form başarıyla gönderildi! Konsola bakın.');
      } else {
        console.error('Backend error:', response.status);
        alert('Bir hata oluştu: ' + response.status);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Bağlantı hatası: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="demo" className="min-h-screen flex items-center justify-center px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            2 Dakikada <span className="text-purple-400">Hayalinizdeki Oda</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Basit bir form, birkaç not ve opsiyonel fotoğraf ile kişiselleştirilmiş tasarım önerileri alın.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Form */}
          <Card variant="dark" className="p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center">Tasarım Formu</h3>
            
            <div className="space-y-6">
              <FormField
                label="Oda Tipi"
                type="select"
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                options={formConfig.roomTypes}
              />

              <FormField
                label="Tasarım Stili"
                type="select"
                name="designStyle"
                value={formData.designStyle}
                onChange={handleInputChange}
                options={formConfig.designStyles}
              />

              <FormField
                label="Notlarınız"
                type="textarea"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={formConfig.placeholders.notes}
              />

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Oda Fotoğrafı (Opsiyonel)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-gray-400">
                      {formData.photo ? formData.photo.name : 'Fotoğraf yükleyin'}
                    </p>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor... ⏳' : 'Hayal Et! ✨'}
              </Button>
            </div>
          </Card>

          {/* Result Mockup */}
          <div className="space-y-6">
            <Card variant="dark" className="p-8">
              <h3 className="text-2xl font-semibold mb-4">📝 Tasarım Önerisi</h3>
              <p className="text-gray-300 leading-relaxed">
                "Modern ve Aydınlık Okuma Köşeniz için özel tasarım konsepti hazırlandı. 
                Doğal ahşap tonları ve minimalist çizgilerle..."
              </p>
            </Card>

            <Card variant="dark" className="p-8">
              <h3 className="text-2xl font-semibold mb-4">🎨 İlham Panosu</h3>
              <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl h-48 flex items-center justify-center">
                <span className="text-6xl">🖼️</span>
              </div>
            </Card>

            <Card variant="dark" className="p-6">
              <h3 className="text-xl font-semibold mb-4">🛍️ Öne Çıkan Ürün</h3>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🪑</span>
                </div>
                <div>
                  <p className="font-medium">İskandinav Tarzı Okuma Koltuğu</p>
                  <p className="text-purple-400 font-semibold">₺2,890</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoSection;
