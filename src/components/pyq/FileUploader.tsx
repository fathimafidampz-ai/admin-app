'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, FileSpreadsheet, Download, X } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface FileUploaderProps {
  onFileProcessed: (data: any[], columns: string[]) => void;
}

export function FileUploader({ onFileProcessed }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        // Process CSV
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const columns = results.meta.fields || [];
            onFileProcessed(results.data, columns);
            setIsProcessing(false);
          },
          error: (error) => {
            alert('Error parsing CSV: ' + error.message);
            setIsProcessing(false);
          },
        });
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Process Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          if (jsonData.length > 0) {
            const columns = Object.keys(jsonData[0] as object);
            onFileProcessed(jsonData, columns);
          }
          setIsProcessing(false);
        };
        reader.readAsBinaryString(file);
      } else {
        alert('Please upload a CSV or Excel file');
        setIsProcessing(false);
      }
    } catch (error) {
      alert('Error processing file');
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `exam_name,subject_name,chapter_name,topic_name,concept_name,year,question_content,option_a,option_b,option_c,option_d,correct_answer,difficulty,discrimination,guessing,explanation,tags
JEE Main,Mathematics,Algebra,Linear Equations,Substitution Method,2023,"Solve: 2x + 3y = 12, x - y = 1",x=3 y=2,x=2 y=3,x=4 y=1,x=1 y=4,A,0.5,1.5,0.25,Use substitution method to solve,algebra;equations;2023
`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pyq_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Questions File</CardTitle>
        <CardDescription>Import questions from CSV or Excel file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Download Template */}
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Sample Template
        </Button>

        {/* File Upload Area */}
        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Click to upload CSV or Excel file
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: .csv, .xlsx, .xls
            </p>
          </div>
        ) : (
          <div className="border-2 border-primary-300 bg-primary-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-8 h-8 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <Button
              variant="primary"
              onClick={processFile}
              isLoading={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing...' : 'Process File'}
            </Button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Instructions */}
<div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
    How to upload PYQ questions:
  </h4>
  <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
    <li className="flex items-start gap-2">
      <span className="font-semibold">1.</span>
      <span>Download the sample template to see the required format</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="font-semibold">2.</span>
      <span>Fill in your question data following the template structure</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="font-semibold">3.</span>
      <span>Upload your CSV or Excel file using the upload area above</span>
    </li>
    <li className="flex items-start gap-2">
      <span className="font-semibold">4.</span>
      <span>Map the columns and preview before importing</span>
    </li>
  </ol>
</div>
      </CardContent>
    </Card>
  );
}