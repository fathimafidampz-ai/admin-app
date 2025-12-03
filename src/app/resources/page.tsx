'use client';

import { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, FileText, Image, Video, File, X } from 'lucide-react';

export default function ResourcesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (uploadedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    
    alert(`Uploading ${uploadedFiles.length} file(s)...`);
    console.log('Files to upload:', uploadedFiles);
    
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      return <Image className="w-8 h-8 text-blue-500 dark:text-blue-400" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) {
      return <Video className="w-8 h-8 text-purple-500 dark:text-purple-400" />;
    }
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) {
      return <FileText className="w-8 h-8 text-red-500 dark:text-red-400" />;
    }
    return <File className="w-8 h-8 text-gray-500 dark:text-gray-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <AppLayout
      title="Upload Resources"
      subtitle="Add learning materials, PDFs, videos, and images"
    >
      <div className="max-w-4xl mx-auto">
        {/* Upload Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Learning Materials</CardTitle>
            <CardDescription>
              Upload PDFs, videos, images, and other educational resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all cursor-pointer"
            >
              <Upload className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Click to upload files
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Supports: PDF, Images (JPG, PNG), Videos (MP4), Documents
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov,.doc,.docx,.ppt,.pptx,.txt"
            />
          </CardContent>
        </Card>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Files ({uploadedFiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    {getFileIcon(file.name)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                onClick={handleUpload}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {uploadedFiles.length} File{uploadedFiles.length !== 1 ? 's' : ''}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resource Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5 font-bold">•</span>
                <span>Maximum file size: 100 MB per file</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5 font-bold">•</span>
                <span>Supported formats: PDF, JPG, PNG, MP4, DOC, PPT</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5 font-bold">•</span>
                <span>Use descriptive file names for easy searching</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 mt-0.5 font-bold">•</span>
                <span>Resources will be linked to your content hierarchy</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}