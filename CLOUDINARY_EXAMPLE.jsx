// MISOL: Admin Panelda kitob qo'shish

import { uploadToCloudinary } from '@/lib/cloudinary';
import { useState } from 'react';

export default function AddBookExample() {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload to Cloudinary
      const { url, publicId } = await uploadToCloudinary(file, 'books');
      
      console.log('Uploaded URL:', url);
      // URL ni MongoDB ga saqlang
      
      // Misol: API ga yuborish
      await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Kitob nomi',
          image: url, // Cloudinary URL
          cloudinaryId: publicId // O'chirish uchun kerak
        })
      });

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && <p>Yuklanmoqda...</p>}
    </div>
  );
}
