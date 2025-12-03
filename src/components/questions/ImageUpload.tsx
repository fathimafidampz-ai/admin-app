'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  label: string;
  onImageSelect: (file: File | null) => void;
  currentImage?: File | string;
  helperText?: string;
}

export function ImageUpload({ label, onImageSelect, currentImage, helperText }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      onImageSelect(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview || currentImage ? (
        <div className="relative inline-block">
          <img
            src={preview || (typeof currentImage === 'string' ? currentImage : '')}
            alt="Preview"
            className="w-full max-w-xs h-auto rounded-lg border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-error-500 text-white rounded-full hover:bg-error-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full max-w-xs p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-gray-100 rounded-full group-hover:bg-primary-100 transition-colors">
              <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {helperText && (
        <p className="text-xs text-gray-500 mt-2">{helperText}</p>
      )}
    </div>
  );
}