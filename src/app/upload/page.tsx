'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Upload, FileSpreadsheet, Plus, Trash2, Image as ImageIcon, 
  CheckCircle, AlertCircle, Loader2, Download, FileText 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsApi, hierarchyApi, uploadImage } from '@/lib/api';
import * as XLSX from 'xlsx';

interface BulkQuestion {
  content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: number;
  discrimination: number;
  guessing: number;
  tags?: string;
  explanation?: string;
  year?: number;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  // ✅ CHECK AUTHENTICATION
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [selectedConcept, setSelectedConcept] = useState('');
  const [bulkQuestions, setBulkQuestions] = useState<BulkQuestion[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: string[];
  }>({ total: 0, success: 0, failed: 0, errors: [] });

  // Single question form
  const [formData, setFormData] = useState({
    content: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    difficulty: 0.5,
    discrimination: 1.5,
    guessing: 0.25,
    tags: '',
    explanation: '',
    year: new Date().getFullYear(),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const queryClient = useQueryClient();

  // Fetch concepts for dropdown
  const { data: concepts } = useQuery({
    queryKey: ['concepts'],
    queryFn: () => hierarchyApi.getConcepts(),
  });

  const uploadMutation = useMutation({
    mutationFn: (data: any) => questionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      resetForm();
      alert('Question uploaded successfully!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      alert('Failed to upload question. Please try again.');
    },
  });

  const bulkUploadMutation = useMutation({
    mutationFn: (questions: any[]) => questionsApi.bulkCreate(questions),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setUploadStatus({
        total: bulkQuestions.length,
        success: data?.length || bulkQuestions.length,
        failed: 0,
        errors: [],
      });
      alert(`Successfully uploaded ${data?.length || bulkQuestions.length} questions!`);
      setBulkQuestions([]);
    },
    onError: (error: any) => {
      console.error('Bulk upload error:', error);
      setUploadStatus({
        total: bulkQuestions.length,
        success: 0,
        failed: bulkQuestions.length,
        errors: [error.message || 'Bulk upload failed'],
      });
      alert('Bulk upload failed. Please check the errors.');
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Convert Excel data to question format
        const questions: BulkQuestion[] = jsonData.map((row) => ({
          content: row['Question'] || row['content'] || '',
          option_a: row['Option A'] || row['option_a'] || '',
          option_b: row['Option B'] || row['option_b'] || '',
          option_c: row['Option C'] || row['option_c'] || '',
          option_d: row['Option D'] || row['option_d'] || '',
          correct_answer: row['Correct Answer'] || row['correct_answer'] || 'A',
          difficulty: parseFloat(row['Difficulty'] || row['difficulty'] || '0.5'),
          discrimination: parseFloat(row['Discrimination'] || row['discrimination'] || '1.5'),
          guessing: parseFloat(row['Guessing'] || row['guessing'] || '0.25'),
          tags: row['Tags'] || row['tags'] || '',
          explanation: row['Explanation'] || row['explanation'] || '',
          year: parseInt(row['Year'] || row['year'] || new Date().getFullYear()),
        }));

        setBulkQuestions(questions);
        alert(`Loaded ${questions.length} questions from Excel file`);
      } catch (error) {
        console.error('Excel parsing error:', error);
        alert('Failed to parse Excel file. Please check the format.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSingleUpload = async () => {
    if (!formData.content || !selectedConcept) {
      alert('Please fill in question content and select a concept');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = undefined;

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'question');
      }

      const questionData = {
        ...formData,
        concept_id: selectedConcept,
        image_url: imageUrl,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
      };

      uploadMutation.mutate(questionData);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload question');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = () => {
    if (bulkQuestions.length === 0) {
      alert('No questions to upload');
      return;
    }

    if (!selectedConcept) {
      alert('Please select a concept');
      return;
    }

    const questionsWithConcept = bulkQuestions.map(q => ({
      ...q,
      concept_id: selectedConcept,
      tags: q.tags ? q.tags.split(',').map(t => t.trim()) : [],
    }));

    bulkUploadMutation.mutate(questionsWithConcept);
  };

  const resetForm = () => {
    setFormData({
      content: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      difficulty: 0.5,
      discrimination: 1.5,
      guessing: 0.25,
      tags: '',
      explanation: '',
      year: new Date().getFullYear(),
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const downloadTemplate = () => {
    const template = [
      {
        'Question': 'Sample question here?',
        'Option A': 'First option',
        'Option B': 'Second option',
        'Option C': 'Third option',
        'Option D': 'Fourth option',
        'Correct Answer': 'A',
        'Difficulty': 0.5,
        'Discrimination': 1.5,
        'Guessing': 0.25,
        'Tags': 'tag1,tag2',
        'Explanation': 'Explanation here',
        'Year': new Date().getFullYear(),
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    XLSX.writeFile(wb, 'question_template.xlsx');
  };

  return (
    <AppLayout
      title="Upload Questions"
      subtitle="Add questions to your question bank"
    >
      {/* Upload Mode Toggle */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={uploadMode === 'single' ? 'primary' : 'outline'}
          onClick={() => setUploadMode('single')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Single Question
        </Button>
        <Button
          variant={uploadMode === 'bulk' ? 'primary' : 'outline'}
          onClick={() => setUploadMode('bulk')}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Bulk Upload (Excel/CSV)
        </Button>
      </div>

      {/* Concept Selection (Required for both modes) */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Concept *
          </label>
          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select concept...</option>
            {concepts?.map((concept: any) => (
              <option key={concept.id} value={concept.id}>
                {concept.name}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Single Upload Mode */}
      {uploadMode === 'single' ? (
        <Card>
          <CardHeader>
            <CardTitle>Single Question Upload</CardTitle>
            <CardDescription>Upload one question at a time</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Question Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question *
              </label>
              <textarea
                placeholder="Enter your question..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Question Image (Optional)
              </label>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {imageFile ? 'Change Image' : 'Upload Image'}
                </Button>
                {imageFile && (
                  <span className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle className="w-4 h-4 text-success-600" />
                    {imageFile.name}
                  </span>
                )}
              </div>
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-3 max-h-48 rounded-lg" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Option A *
                </label>
                <Input
                  value={formData.option_a}
                  onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Option B *
                </label>
                <Input
                  value={formData.option_b}
                  onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Option C *
                </label>
                <Input
                  value={formData.option_c}
                  onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Option D *
                </label>
                <Input
                  value={formData.option_d}
                  onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                />
              </div>
            </div>

            {/* Correct Answer & 3PL Parameters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Correct Answer *
                </label>
                <select
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discrimination
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.discrimination}
                  onChange={(e) => setFormData({ ...formData, discrimination: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Guessing
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.guessing}
                  onChange={(e) => setFormData({ ...formData, guessing: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            {/* Tags & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags (comma-separated)
                </label>
                <Input
                  placeholder="physics, mechanics, newton"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Explanation (Optional)
              </label>
              <textarea
                placeholder="Explain the correct answer..."
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleSingleUpload}
                disabled={uploading || uploadMutation.isPending}
                className="flex-1"
              >
                {uploading || uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Question
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Bulk Upload Mode */
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload via Excel/CSV</CardTitle>
            <CardDescription>Upload multiple questions at once</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Download Template */}
            <div className="mb-6">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="w-4 h-4 mr-2" />
                Download Excel Template
              </Button>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Download the template, fill it with your questions, and upload it below
              </p>
            </div>

            {/* Upload Excel */}
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={() => excelInputRef.current?.click()}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Select Excel/CSV File
              </Button>
              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </div>

            {/* Preview Questions */}
            {bulkQuestions.length > 0 && (
              <>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Loaded Questions: {bulkQuestions.length}
                  </h3>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {bulkQuestions.slice(0, 5).map((q, idx) => (
                      <div key={idx} className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                        <p className="font-medium text-gray-900 dark:text-white">{idx + 1}. {q.content}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Correct: {q.correct_answer} | Difficulty: {q.difficulty}
                        </p>
                      </div>
                    ))}
                    {bulkQuestions.length > 5 && (
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        ...and {bulkQuestions.length - 5} more questions
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={handleBulkUpload}
                  disabled={bulkUploadMutation.isPending}
                  className="w-full"
                >
                  {bulkUploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading {bulkQuestions.length} questions...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {bulkQuestions.length} Questions
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Upload Status */}
            {uploadStatus.total > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Results</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>{' '}
                    <span className="font-medium">{uploadStatus.total}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-success-600 dark:text-success-400">Success:</span>{' '}
                    <span className="font-medium">{uploadStatus.success}</span>
                  </p>
                  {uploadStatus.failed > 0 && (
                    <>
                      <p className="text-sm">
                        <span className="text-error-600 dark:text-error-400">Failed:</span>{' '}
                        <span className="font-medium">{uploadStatus.failed}</span>
                      </p>
                      {uploadStatus.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-error-600 dark:text-error-400 mb-1">Errors:</p>
                          <ul className="text-xs text-error-600 dark:text-error-400 space-y-1">
                            {uploadStatus.errors.map((err, idx) => (
                              <li key={idx}>• {err}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AppLayout>
  );
}