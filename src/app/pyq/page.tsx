'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { FileUploader } from '@/components/pyq/FileUploader';
import { ColumnMapper } from '@/components/pyq/ColumnMapper';
import { BulkPreview } from '@/components/pyq/BulkPreview';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, Upload } from 'lucide-react';
import { ColumnMapping } from '@/types';

type Step = 'upload' | 'mapping' | 'preview' | 'complete';

export default function PYQPage() {
  const [step, setStep] = useState<Step>('upload');
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [importResult, setImportResult] = useState<any>(null);

  const handleFileProcessed = (data: any[], columns: string[]) => {
    setFileData(data);
    setFileColumns(columns);
    setStep('mapping');
  };

  const handleMappingComplete = (mapping: ColumnMapping) => {
    setColumnMapping(mapping);
    setStep('preview');
  };

  const handleImportComplete = (result: any) => {
    setImportResult(result);
    setStep('complete');
  };

  const handleStartOver = () => {
    setStep('upload');
    setFileData([]);
    setFileColumns([]);
    setColumnMapping(null);
    setImportResult(null);
  };

  return (
    <AppLayout
      title="Upload PYQ (Previous Year Questions)"
      subtitle="Bulk import questions from CSV or Excel files"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 'upload' ? 'bg-primary-500 text-white' : 
              ['mapping', 'preview', 'complete'].includes(step) ? 'bg-success-500 text-white' : 
              'bg-gray-200 text-gray-600'
            }`}>
              {['mapping', 'preview', 'complete'].includes(step) ? '✓' : '1'}
            </div>
            <span className={`text-sm font-medium ${
              step === 'upload' ? 'text-primary-700' : 
              ['mapping', 'preview', 'complete'].includes(step) ? 'text-success-700' : 
              'text-gray-600'
            }`}>
              Upload File
            </span>
          </div>

          <div className="flex-1 h-1 bg-gray-200 mx-4">
            <div className={`h-full transition-all duration-300 ${
              ['mapping', 'preview', 'complete'].includes(step) ? 'bg-success-500 w-full' : 'bg-gray-200 w-0'
            }`} />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 'mapping' ? 'bg-primary-500 text-white' : 
              ['preview', 'complete'].includes(step) ? 'bg-success-500 text-white' : 
              'bg-gray-200 text-gray-600'
            }`}>
              {['preview', 'complete'].includes(step) ? '✓' : '2'}
            </div>
            <span className={`text-sm font-medium ${
              step === 'mapping' ? 'text-primary-700' : 
              ['preview', 'complete'].includes(step) ? 'text-success-700' : 
              'text-gray-600'
            }`}>
              Map Columns
            </span>
          </div>

          <div className="flex-1 h-1 bg-gray-200 mx-4">
            <div className={`h-full transition-all duration-300 ${
              ['preview', 'complete'].includes(step) ? 'bg-success-500 w-full' : 'bg-gray-200 w-0'
            }`} />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === 'preview' ? 'bg-primary-500 text-white' : 
              step === 'complete' ? 'bg-success-500 text-white' : 
              'bg-gray-200 text-gray-600'
            }`}>
              {step === 'complete' ? '✓' : '3'}
            </div>
            <span className={`text-sm font-medium ${
              step === 'preview' ? 'text-primary-700' : 
              step === 'complete' ? 'text-success-700' : 
              'text-gray-600'
            }`}>
              Preview & Import
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto">
        {step === 'upload' && (
          <FileUploader onFileProcessed={handleFileProcessed} />
        )}

        {step === 'mapping' && (
          <ColumnMapper
            fileColumns={fileColumns}
            onMappingComplete={handleMappingComplete}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'preview' && columnMapping && (
          <BulkPreview
            data={fileData}
            mapping={columnMapping}
            onBack={() => setStep('mapping')}
            onComplete={handleImportComplete}
          />
        )}

        {step === 'complete' && importResult && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-success-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Import Successful!
                </h2>
                <p className="text-gray-600 mb-8">
                  Your questions have been imported successfully
                </p>

                {/* Results Summary */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-success-50 border border-success-200 rounded-lg">
                      <p className="text-3xl font-bold text-success-900">
                        {importResult.success}
                      </p>
                      <p className="text-sm text-success-700">Imported</p>
                    </div>
                    <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
                      <p className="text-3xl font-bold text-error-900">
                        {importResult.failed}
                      </p>
                      <p className="text-sm text-error-700">Failed</p>
                    </div>
                  </div>
                </div>

                {/* Error Details */}
                {importResult.errors && importResult.errors.length > 0 && (
                  <div className="max-w-md mx-auto mb-8 text-left">
                    <p className="font-semibold text-gray-900 mb-3">Error Details:</p>
                    <div className="bg-error-50 border border-error-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                      {importResult.errors.map((error: any, index: number) => (
                        <p key={index} className="text-sm text-error-700 mb-2">
                          Row {error.row}: {error.error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleStartOver}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload More
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = '/browse'}
                  >
                    View Questions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}