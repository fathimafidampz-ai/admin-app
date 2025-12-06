'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Upload, Save, X, ImageIcon, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function UploadQuestionsPage() {
  const router = useRouter();

  // ✅ CHECK AUTHENTICATION
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Image refs
  const questionImageRef = useRef<HTMLInputElement>(null);
  const optionAImageRef = useRef<HTMLInputElement>(null);
  const optionBImageRef = useRef<HTMLInputElement>(null);
  const optionCImageRef = useRef<HTMLInputElement>(null);
  const optionDImageRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    conceptId: '',
    content: '',
    questionImage: null as File | null,
    questionImagePreview: '',
    optionA: '',
    optionAImage: null as File | null,
    optionAImagePreview: '',
    optionB: '',
    optionBImage: null as File | null,
    optionBImagePreview: '',
    optionC: '',
    optionCImage: null as File | null,
    optionCImagePreview: '',
    optionD: '',
    optionDImage: null as File | null,
    optionDImagePreview: '',
    correctAnswer: 'A',
    difficulty: '0.5',
    discrimination: '1.5',
    guessing: '0.25',
    explanation: '',
    tags: '',
    year: new Date().getFullYear().toString(),
  });

  const handleImageSelect = (
    field: 'questionImage' | 'optionAImage' | 'optionBImage' | 'optionCImage' | 'optionDImage',
    file: File | null
  ) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [field]: file,
          [`${field}Preview`]: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (
    field: 'questionImage' | 'optionAImage' | 'optionBImage' | 'optionCImage' | 'optionDImage'
  ) => {
    setFormData({
      ...formData,
      [field]: null,
      [`${field}Preview`]: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock save
    console.log('Saving question:', formData);
    alert('Question created successfully!');
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      conceptId: '',
      content: '',
      questionImage: null,
      questionImagePreview: '',
      optionA: '',
      optionAImage: null,
      optionAImagePreview: '',
      optionB: '',
      optionBImage: null,
      optionBImagePreview: '',
      optionC: '',
      optionCImage: null,
      optionCImagePreview: '',
      optionD: '',
      optionDImage: null,
      optionDImagePreview: '',
      correctAnswer: 'A',
      difficulty: '0.5',
      discrimination: '1.5',
      guessing: '0.25',
      explanation: '',
      tags: '',
      year: new Date().getFullYear().toString(),
    });
  };

  const ImageUploadSection = ({
    label,
    imagePreview,
    onUpload,
    onRemove,
    inputRef,
  }: {
    label: string;
    imagePreview: string;
    onUpload: (file: File) => void;
    onRemove: () => void;
    inputRef: React.RefObject<HTMLInputElement>;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} (Optional)
      </label>
      {!imagePreview ? (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer bg-white dark:bg-gray-800/30"
        >
          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Click to upload image
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            PNG, JPG up to 5MB
          </p>
        </div>
      ) : (
        <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
          <div className="relative w-full h-48">
            <Image
              src={imagePreview}
              alt={label}
              fill
              className="object-contain rounded"
            />
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-2 bg-error-500 hover:bg-error-600 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
        }}
        className="hidden"
      />
    </div>
  );

  return (
    <AppLayout
      title="Upload Questions"
      subtitle="Add new questions to your question bank"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                <Upload className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <CardTitle>Create New Question</CardTitle>
                <CardDescription>Fill in the details to add a question to your bank</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Question Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={4}
                  placeholder="Enter the question text..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
                />
              </div>

              {/* Question Image */}
              <ImageUploadSection
                label="Question Image"
                imagePreview={formData.questionImagePreview}
                onUpload={(file) => handleImageSelect('questionImage', file)}
                onRemove={() => handleRemoveImage('questionImage')}
                inputRef={questionImageRef}
              />

              {/* Option A */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Option A *</h3>
                <Input
                  label="Option A Text *"
                  value={formData.optionA}
                  onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                  required
                  placeholder="Enter option A"
                />
                <ImageUploadSection
                  label="Option A Image"
                  imagePreview={formData.optionAImagePreview}
                  onUpload={(file) => handleImageSelect('optionAImage', file)}
                  onRemove={() => handleRemoveImage('optionAImage')}
                  inputRef={optionAImageRef}
                />
              </div>

              {/* Option B */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Option B *</h3>
                <Input
                  label="Option B Text *"
                  value={formData.optionB}
                  onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                  required
                  placeholder="Enter option B"
                />
                <ImageUploadSection
                  label="Option B Image"
                  imagePreview={formData.optionBImagePreview}
                  onUpload={(file) => handleImageSelect('optionBImage', file)}
                  onRemove={() => handleRemoveImage('optionBImage')}
                  inputRef={optionBImageRef}
                />
              </div>

              {/* Option C */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Option C *</h3>
                <Input
                  label="Option C Text *"
                  value={formData.optionC}
                  onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                  required
                  placeholder="Enter option C"
                />
                <ImageUploadSection
                  label="Option C Image"
                  imagePreview={formData.optionCImagePreview}
                  onUpload={(file) => handleImageSelect('optionCImage', file)}
                  onRemove={() => handleRemoveImage('optionCImage')}
                  inputRef={optionCImageRef}
                />
              </div>

              {/* Option D */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Option D *</h3>
                <Input
                  label="Option D Text *"
                  value={formData.optionD}
                  onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                  required
                  placeholder="Enter option D"
                />
                <ImageUploadSection
                  label="Option D Image"
                  imagePreview={formData.optionDImagePreview}
                  onUpload={(file) => handleImageSelect('optionDImage', file)}
                  onRemove={() => handleRemoveImage('optionDImage')}
                  inputRef={optionDImageRef}
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correct Answer *
                </label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              {/* 3PL Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty (0-1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0 = Easy, 1 = Hard</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discrimination (0-3)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="3"
                    value={formData.discrimination}
                    onChange={(e) => setFormData({ ...formData, discrimination: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">How well it differentiates</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Guessing (0-0.5)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="0.5"
                    value={formData.guessing}
                    onChange={(e) => setFormData({ ...formData, guessing: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Probability of random correct</p>
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  rows={3}
                  placeholder="Provide a detailed explanation of the correct answer..."
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 transition-colors resize-none"
                />
              </div>

              {/* Tags & Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tags (comma-separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., algebra, equations, difficult"
                />
                <Input
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2024"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Question
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  <X className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}