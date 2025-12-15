'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Upload, FileSpreadsheet, Plus, Trash2, Image as ImageIcon, 
  CheckCircle, AlertCircle, Loader2, Download, FileText, X,
  Network, BookOpen, List
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

interface HierarchyPath {
  exam_id: string;
  exam_name: string;
  exam_type: string;
  class_id?: string;
  class_name?: string;
  subject_id?: string;
  subject_name?: string;
  chapter_id?: string;
  chapter_name?: string;
  topic_id?: string;
  topic_name?: string;
  attribute_names?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [uploadMode, setUploadMode] = useState<'single' | 'multiple' | 'bulk'>('single');
  const [hierarchyPath, setHierarchyPath] = useState<HierarchyPath>({
    exam_id: '',
    exam_name: '',
    exam_type: '',
  });

  // Hierarchy selections
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const [bulkQuestions, setBulkQuestions] = useState<BulkQuestion[]>([]);
  const [uploadStatus, setUploadStatus] = useState<{
    total: number;
    success: number;
    failed: number;
    errors: string[];
  }>({ total: 0, success: 0, failed: 0, errors: [] });

  // Multiple questions state
  const [multipleQuestions, setMultipleQuestions] = useState([{
    id: Date.now(),
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
    image: null as File | null,
    imagePreview: null as string | null,
    option_a_image: null as File | null,
    option_a_image_preview: null as string | null,
    option_b_image: null as File | null,
    option_b_image_preview: null as string | null,
    option_c_image: null as File | null,
    option_c_image_preview: null as string | null,
    option_d_image: null as File | null,
    option_d_image_preview: null as string | null,
    selectedAttributes: [] as string[],
  }]);

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

  const [optionImages, setOptionImages] = useState({
    option_a: null as File | null,
    option_b: null as File | null,
    option_c: null as File | null,
    option_d: null as File | null,
  });

  const [optionImagePreviews, setOptionImagePreviews] = useState({
    option_a: null as string | null,
    option_b: null as string | null,
    option_c: null as string | null,
    option_d: null as string | null,
  });

  const queryClient = useQueryClient();

  // Fetch hierarchy data
  const { data: exams } = useQuery({
    queryKey: ['exams'],
    queryFn: () => hierarchyApi.getAllExams(),
  });

  const { data: classes } = useQuery({
    queryKey: ['classes', selectedExam],
    queryFn: () => hierarchyApi.getClasses(selectedExam),
    enabled: !!selectedExam && hierarchyPath.exam_type === 'school',
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects', selectedExam, selectedClass],
    queryFn: () => hierarchyApi.getSubjects(
      hierarchyPath.exam_type === 'competitive' ? selectedExam : undefined,
      hierarchyPath.exam_type === 'school' ? selectedClass : undefined
    ),
    enabled: (hierarchyPath.exam_type === 'competitive' && !!selectedExam) || 
             (hierarchyPath.exam_type === 'school' && !!selectedClass),
  });

  const { data: chapters } = useQuery({
    queryKey: ['chapters', selectedSubject],
    queryFn: () => hierarchyApi.getChapters(selectedSubject),
    enabled: !!selectedSubject,
  });

  const { data: topics } = useQuery({
    queryKey: ['topics', selectedChapter],
    queryFn: () => hierarchyApi.getTopics(selectedChapter),
    enabled: !!selectedChapter,
  });

  const { data: attributes, isLoading: attributesLoading } = useQuery({
    queryKey: ['attributes', selectedTopic],
    queryFn: () => hierarchyApi.getAttributes(selectedTopic),
    enabled: !!selectedTopic,
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

  const handleExamChange = (examId: string) => {
    const exam = exams?.find((e: any) => e.id === examId);
    setSelectedExam(examId);
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedTopic('');
    setSelectedAttributes([]);
    
    if (exam) {
      setHierarchyPath({
        exam_id: exam.id,
        exam_name: exam.name,
        exam_type: exam.exam_type,
      });
    }
  };

  const handleClassChange = (classId: string) => {
    const classItem = classes?.find((c: any) => c.id === classId);
    setSelectedClass(classId);
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedTopic('');
    setSelectedAttributes([]);
    
    if (classItem) {
      setHierarchyPath(prev => ({
        ...prev,
        class_id: classItem.id,
        class_name: classItem.name,
      }));
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    const subject = subjects?.find((s: any) => s.id === subjectId);
    setSelectedSubject(subjectId);
    setSelectedChapter('');
    setSelectedTopic('');
    setSelectedAttributes([]);
    
    if (subject) {
      setHierarchyPath(prev => ({
        ...prev,
        subject_id: subject.id,
        subject_name: subject.name,
      }));
    }
  };

  const handleChapterChange = (chapterId: string) => {
    const chapter = chapters?.find((c: any) => c.id === chapterId);
    setSelectedChapter(chapterId);
    setSelectedTopic('');
    setSelectedAttributes([]);
    
    if (chapter) {
      setHierarchyPath(prev => ({
        ...prev,
        chapter_id: chapter.id,
        chapter_name: chapter.name,
      }));
    }
  };

  const handleTopicChange = (topicId: string) => {
    const topic = topics?.find((t: any) => t.id === topicId);
    setSelectedTopic(topicId);
    setSelectedAttributes([]);
    
    if (topic) {
      setHierarchyPath(prev => ({
        ...prev,
        topic_id: topic.id,
        topic_name: topic.name,
      }));
    }
  };

  const handleAttributeToggle = (attributeId: string) => {
    setSelectedAttributes(prev => {
      const newSelected = prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId];
      
      // Update hierarchy path with selected attribute names
      const selectedAttrNames = attributes
        ?.filter((a: any) => newSelected.includes(a.id))
        .map((a: any) => a.name)
        .join(', ');
      
      setHierarchyPath(current => ({
        ...current,
        attribute_names: selectedAttrNames,
      }));
      
      return newSelected;
    });
  };

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

  const handleOptionImageChange = (option: string, file: File | null) => {
    if (file) {
      setOptionImages(prev => ({ ...prev, [option]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setOptionImagePreviews(prev => ({ ...prev, [option]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setOptionImages(prev => ({ ...prev, [option]: null }));
      setOptionImagePreviews(prev => ({ ...prev, [option]: null }));
    }
  };

  const handleMultipleImageSelect = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newQuestions = [...multipleQuestions];
      newQuestions[index].image = file;
      newQuestions[index].imagePreview = reader.result as string;
      setMultipleQuestions(newQuestions);
    };
    reader.readAsDataURL(file);
  };

  const handleOptionImageSelect = (questionIndex: number, optionKey: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const newQuestions = [...multipleQuestions];
      (newQuestions[questionIndex] as any)[`${optionKey}_image`] = file;
      (newQuestions[questionIndex] as any)[`${optionKey}_image_preview`] = reader.result as string;
      setMultipleQuestions(newQuestions);
    };
    reader.readAsDataURL(file);
  };

  const removeOptionImage = (questionIndex: number, optionKey: string) => {
    const newQuestions = [...multipleQuestions];
    (newQuestions[questionIndex] as any)[`${optionKey}_image`] = null;
    (newQuestions[questionIndex] as any)[`${optionKey}_image_preview`] = null;
    setMultipleQuestions(newQuestions);
  };

  const addMultipleQuestion = () => {
    setMultipleQuestions([...multipleQuestions, {
      id: Date.now(),
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
      image: null,
      imagePreview: null,
      option_a_image: null,
      option_a_image_preview: null,
      option_b_image: null,
      option_b_image_preview: null,
      option_c_image: null,
      option_c_image_preview: null,
      option_d_image: null,
      option_d_image_preview: null,
      selectedAttributes: [],
    }]);
  };

  const removeMultipleQuestion = (index: number) => {
    setMultipleQuestions(multipleQuestions.filter((_, i) => i !== index));
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
    if (!formData.content || selectedAttributes.length === 0) {
      alert('Please fill in question content and select at least one attribute');
      return;
    }

    setUploading(true);

    try {
      let imageUrl = undefined;
      const optionImageUrls: any = {};

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'question');
      }

      for (const [key, file] of Object.entries(optionImages)) {
        if (file) {
          optionImageUrls[`${key}_image`] = await uploadImage(file, 'option');
        }
      }

      const questionData = {
        question: {
          content: formData.content,
          options: [formData.option_a, formData.option_b, formData.option_c, formData.option_d],
          correct_answer: formData.correct_answer,
          difficulty: formData.difficulty,
          discrimination: formData.discrimination,
          guessing: formData.guessing,
          exam_id: hierarchyPath.exam_id,
          subject_id: hierarchyPath.subject_id,
          chapter_id: hierarchyPath.chapter_id,
          topic_id: hierarchyPath.topic_id,
          image_url: imageUrl,
          option_a_image: optionImageUrls['option_a_image'],
          option_b_image: optionImageUrls['option_b_image'],
          option_c_image: optionImageUrls['option_c_image'],
          option_d_image: optionImageUrls['option_d_image'],
          tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
          explanation: formData.explanation,
          year: formData.year,
        },
        selected_attributes: selectedAttributes.map(attrId => ({
          attribute_id: attrId,
          value: true
        })),
        create_new_attributes: []
      };

      uploadMutation.mutate(questionData);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload question');
    } finally {
      setUploading(false);
    }
  };

  const handleMultipleUpload = async () => {
    const incompleteQuestions = multipleQuestions.filter(
      q => !q.content || !q.option_a || !q.option_b || q.selectedAttributes.length === 0
    );
    
    if (incompleteQuestions.length > 0) {
      alert('Please fill in all required fields and select at least one attribute for each question');
      return;
    }

    setUploading(true);

    try {
      const questionsData = await Promise.all(
        multipleQuestions.map(async (q) => {
          let imageUrl = undefined;
          const optionImageUrls: any = {};

          if (q.image) {
            imageUrl = await uploadImage(q.image, 'question');
          }

          for (const opt of ['option_a', 'option_b', 'option_c', 'option_d']) {
            const optImage = (q as any)[`${opt}_image`];
            if (optImage) {
              optionImageUrls[`${opt}_image`] = await uploadImage(optImage, 'option');
            }
          }

          return {
            question: {
              content: q.content,
              options: [q.option_a, q.option_b, q.option_c, q.option_d],
              correct_answer: q.correct_answer,
              difficulty: q.difficulty,
              discrimination: q.discrimination,
              guessing: q.guessing,
              exam_id: hierarchyPath.exam_id,
              subject_id: hierarchyPath.subject_id,
              chapter_id: hierarchyPath.chapter_id,
              topic_id: hierarchyPath.topic_id,
              tags: q.tags ? q.tags.split(',').map(t => t.trim()) : [],
              explanation: q.explanation,
              year: q.year,
              image_url: imageUrl,
              ...optionImageUrls,
            },
            selected_attributes: q.selectedAttributes.map(attrId => ({
              attribute_id: attrId,
              value: true
            })),
            create_new_attributes: []
          };
        })
      );

      bulkUploadMutation.mutate(questionsData);
      setMultipleQuestions([{
        id: Date.now(),
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
        image: null,
        imagePreview: null,
        option_a_image: null,
        option_a_image_preview: null,
        option_b_image: null,
        option_b_image_preview: null,
        option_c_image: null,
        option_c_image_preview: null,
        option_d_image: null,
        option_d_image_preview: null,
        selectedAttributes: [],
      }]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload questions');
    } finally {
      setUploading(false);
    }
  };

  const handleBulkUpload = () => {
    if (bulkQuestions.length === 0) {
      alert('No questions to upload');
      return;
    }

    if (selectedAttributes.length === 0) {
      alert('Please select at least one attribute');
      return;
    }

    const questionsWithAttributes = bulkQuestions.map(q => ({
      question: {
        content: q.content,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correct_answer: q.correct_answer,
        difficulty: q.difficulty,
        discrimination: q.discrimination,
        guessing: q.guessing,
        exam_id: hierarchyPath.exam_id,
        subject_id: hierarchyPath.subject_id,
        chapter_id: hierarchyPath.chapter_id,
        topic_id: hierarchyPath.topic_id,
        tags: q.tags ? q.tags.split(',').map(t => t.trim()) : [],
        explanation: q.explanation,
        year: q.year,
      },
      selected_attributes: selectedAttributes.map(attrId => ({
        attribute_id: attrId,
        value: true
      })),
      create_new_attributes: []
    }));

    bulkUploadMutation.mutate(questionsWithAttributes);
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
    setOptionImages({
      option_a: null,
      option_b: null,
      option_c: null,
      option_d: null,
    });
    setOptionImagePreviews({
      option_a: null,
      option_b: null,
      option_c: null,
      option_d: null,
    });
    setSelectedAttributes([]);
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
          variant={uploadMode === 'multiple' ? 'primary' : 'outline'}
          onClick={() => setUploadMode('multiple')}
        >
          <List className="w-4 h-4 mr-2" />
          Multiple Questions
        </Button>
        <Button
          variant={uploadMode === 'bulk' ? 'primary' : 'outline'}
          onClick={() => setUploadMode('bulk')}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Bulk Upload (Excel)
        </Button>
      </div>

      {/* Hierarchy Selector */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <CardTitle>Select Hierarchy Path</CardTitle>
          </div>
          <CardDescription>Navigate through the hierarchy to select where to add questions</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Breadcrumb Display */}
          {hierarchyPath.exam_name && (
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-700">
              <div className="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300 flex-wrap">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">{hierarchyPath.exam_name}</span>
                {hierarchyPath.class_name && (
                  <>
                    <span>→</span>
                    <span className="font-semibold">{hierarchyPath.class_name}</span>
                  </>
                )}
                {hierarchyPath.subject_name && (
                  <>
                    <span>→</span>
                    <span className="font-semibold">{hierarchyPath.subject_name}</span>
                  </>
                )}
                {hierarchyPath.chapter_name && (
                  <>
                    <span>→</span>
                    <span className="font-semibold">{hierarchyPath.chapter_name}</span>
                  </>
                )}
                {hierarchyPath.topic_name && (
                  <>
                    <span>→</span>
                    <span className="font-semibold">{hierarchyPath.topic_name}</span>
                  </>
                )}
                {hierarchyPath.attribute_names && (
                  <>
                    <span>→</span>
                    <span className="font-semibold text-success-700 dark:text-success-300">{hierarchyPath.attribute_names}</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Exam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                1. Select Exam *
              </label>
              <select
                value={selectedExam}
                onChange={(e) => handleExamChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select exam...</option>
                {exams?.map((exam: any) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class (for school exams) */}
            {hierarchyPath.exam_type === 'school' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  2. Select Class *
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={!selectedExam}
                >
                  <option value="">Select class...</option>
                  {classes?.map((cls: any) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subject */}
            {((hierarchyPath.exam_type === 'competitive' && selectedExam) || 
              (hierarchyPath.exam_type === 'school' && selectedClass)) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {hierarchyPath.exam_type === 'school' ? '3' : '2'}. Select Subject *
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select subject...</option>
                  {subjects?.map((subject: any) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chapter */}
            {selectedSubject && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {hierarchyPath.exam_type === 'school' ? '4' : '3'}. Select Chapter *
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => handleChapterChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select chapter...</option>
                  {chapters?.map((chapter: any) => (
                    <option key={chapter.id} value={chapter.id}>
                      {chapter.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Topic */}
            {selectedChapter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {hierarchyPath.exam_type === 'school' ? '5' : '4'}. Select Topic *
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => handleTopicChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Select topic...</option>
                  {topics?.map((topic: any) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Single Upload Mode */}
      {uploadMode === 'single' && (
        <Card>
          <CardHeader>
            <CardTitle>Single Question Upload</CardTitle>
            <CardDescription>Upload one question at a time</CardDescription>
          </CardHeader>
          <CardContent>
            {/* ✅ ATTRIBUTE SELECTOR */}
            {selectedTopic && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-2 border-primary-200 dark:border-primary-700">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Select Attributes for this Question *
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-normal">
                    (You can select multiple)
                  </span>
                </label>
                
                {attributesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading attributes...</span>
                  </div>
                ) : attributes && attributes.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attributes.map((attribute: any) => (
                      <label
                        key={attribute.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAttributes.includes(attribute.id)}
                          onChange={() => handleAttributeToggle(attribute.id)}
                          className="mt-1 w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {attribute.name}
                          </div>
                          {attribute.description && (
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                              {attribute.description}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      No attributes found for <strong>{hierarchyPath.topic_name}</strong>.
                      Please go to <strong>Create Hierarchy</strong> page to add attributes first.
                    </p>
                  </div>
                )}
                
                {selectedAttributes.length > 0 && (
                  <div className="mt-3 p-3 bg-success-50 dark:bg-success-900/20 rounded border border-success-200 dark:border-success-800">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success-700 dark:text-success-300 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-success-700 dark:text-success-300">
                          Selected {selectedAttributes.length} attribute{selectedAttributes.length > 1 ? 's' : ''}:
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {attributes
                            ?.filter((a: any) => selectedAttributes.includes(a.id))
                            .map((attr: any) => (
                              <span
                                key={attr.id}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300 rounded text-xs font-medium"
                              >
                                {attr.name}
                                <button
                                  onClick={() => handleAttributeToggle(attr.id)}
                                  className="hover:text-success-900 dark:hover:text-success-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!attributesLoading && attributes && attributes.length > 0 && selectedAttributes.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                    ⚠️ Please select at least one attribute before uploading
                  </p>
                )}
              </div>
            )}

            {!selectedTopic && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  👆 Please select a complete hierarchy path above (Exam → Subject → Chapter → Topic) to choose attributes
                </p>
              </div>
            )}

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
                  type="button"
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
                <img src={imagePreview} alt="Preview" className="mt-3 max-h-48 rounded-lg border border-gray-300 dark:border-gray-600" />
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Options with Image Upload */}
            <div className="grid grid-cols-1 gap-4 mb-4">
              {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, idx) => (
                <div key={opt} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Option {String.fromCharCode(65 + idx)} *
                  </label>
                  <Input
                    value={formData[opt as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [opt]: e.target.value })}
                    className="mb-2"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) handleOptionImageChange(opt, file);
                        };
                        input.click();
                      }}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {optionImages[opt as keyof typeof optionImages] ? 'Change Image' : 'Add Image'}
                    </Button>
                    
                    {optionImages[opt as keyof typeof optionImages] && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleOptionImageChange(opt, null)}
                        className="text-error-600 dark:text-error-400"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {optionImagePreviews[opt as keyof typeof optionImagePreviews] && (
                    <img 
                      src={optionImagePreviews[opt as keyof typeof optionImagePreviews]!} 
                      alt={`Option ${String.fromCharCode(65 + idx)}`} 
                      className="mt-2 max-h-32 rounded-lg border border-gray-300 dark:border-gray-600" 
                    />
                  )}
                </div>
              ))}
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
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty (0-1)
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
                  Guessing (0-1)
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
                disabled={uploading || uploadMutation.isPending || selectedAttributes.length === 0}
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
                    {selectedAttributes.length === 0 && ' (Select Attributes First)'}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multiple Questions Mode */}
      {uploadMode === 'multiple' && (
        <Card>
          <CardHeader>
            <CardTitle>Multiple Questions Upload</CardTitle>
            <CardDescription>Add multiple questions in one go</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {multipleQuestions.map((question, index) => (
                <div key={question.id} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Question {index + 1}
                    </h3>
                    {multipleQuestions.length > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => removeMultipleQuestion(index)}
                        className="text-error-600 dark:text-error-400 border-error-200 dark:border-error-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Question Content */}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Question *
                    </label>
                    <textarea
                      placeholder="Enter question..."
                      value={question.content}
                      onChange={(e) => {
                        const newQuestions = [...multipleQuestions];
                        newQuestions[index].content = e.target.value;
                        setMultipleQuestions(newQuestions);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* ✅ Attribute Selection for this Question */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Attributes (Multiple) *
                    </label>
                    <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-2 bg-white dark:bg-gray-900">
                      {attributes && attributes.length > 0 ? (
                        attributes.map((attribute: any) => (
                          <label
                            key={attribute.id}
                            className="flex items-center gap-2 p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={question.selectedAttributes.includes(attribute.id)}
                              onChange={(e) => {
                                const newQuestions = [...multipleQuestions];
                                if (e.target.checked) {
                                  newQuestions[index].selectedAttributes.push(attribute.id);
                                } else {
                                  newQuestions[index].selectedAttributes = 
                                    newQuestions[index].selectedAttributes.filter(id => id !== attribute.id);
                                }
                                setMultipleQuestions(newQuestions);
                              }}
                              className="w-3 h-3 text-primary-600 rounded"
                            />
                            <span className="text-xs text-gray-900 dark:text-white">{attribute.name}</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500 p-2">No attributes available. Please select a topic first.</p>
                      )}
                    </div>
                    {question.selectedAttributes.length > 0 && (
                      <div className="mt-1 text-xs text-success-600 dark:text-success-400">
                        ✓ {question.selectedAttributes.length} selected
                      </div>
                    )}
                  </div>

                  {/* Image Upload */}
                  <div className="mb-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) handleMultipleImageSelect(index, file);
                        };
                        input.click();
                      }}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      {question.image ? 'Change Image' : 'Add Image'}
                    </Button>
                    {question.imagePreview && (
                      <img src={question.imagePreview} alt="Preview" className="mt-2 max-h-32 rounded-lg border border-gray-300 dark:border-gray-600" />
                    )}
                  </div>

                  {/* Options with Image Upload */}
<div className="grid grid-cols-1 gap-3 mb-3">
  {['option_a', 'option_b', 'option_c', 'option_d'].map((opt, optIdx) => (
    <div key={opt} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        Option {String.fromCharCode(65 + optIdx)} *
      </label>
      <Input
        value={question[opt as keyof typeof question] as string}
        onChange={(e) => {
          const newQuestions = [...multipleQuestions];
          (newQuestions[index] as any)[opt] = e.target.value;
          setMultipleQuestions(newQuestions);
        }}
        className="mb-2"
      />
      
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) handleOptionImageSelect(index, opt, file);
            };
            input.click();
          }}
        >
          <ImageIcon className="w-3 h-3 mr-1" />
          {(question as any)[`${opt}_image`] ? 'Change' : 'Add Image'}
        </Button>
        
        {(question as any)[`${opt}_image`] && (
          <Button
            type="button"
            variant="outline"
            onClick={() => removeOptionImage(index, opt)}
            className="text-error-600 dark:text-error-400"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {(question as any)[`${opt}_image_preview`] && (
        <img 
          src={(question as any)[`${opt}_image_preview`]} 
          alt={`Option ${String.fromCharCode(65 + optIdx)}`} 
          className="mt-2 max-h-24 rounded border border-gray-300 dark:border-gray-600" 
        />
      )}
    </div>
  ))}
</div>

                  {/* Correct Answer & Parameters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Correct *
                      </label>
                      <select
                        value={question.correct_answer}
                        onChange={(e) => {
                          const newQuestions = [...multipleQuestions];
                          newQuestions[index].correct_answer = e.target.value;
                          setMultipleQuestions(newQuestions);
                        }}
                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Difficulty
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={question.difficulty}
                        onChange={(e) => {
                          const newQuestions = [...multipleQuestions];
                          newQuestions[index].difficulty = parseFloat(e.target.value);
                          setMultipleQuestions(newQuestions);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Discrim.
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={question.discrimination}
                        onChange={(e) => {
                          const newQuestions = [...multipleQuestions];
                          newQuestions[index].discrimination = parseFloat(e.target.value);
                          setMultipleQuestions(newQuestions);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Guessing
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={question.guessing}
                        onChange={(e) => {
                          const newQuestions = [...multipleQuestions];
                          newQuestions[index].guessing = parseFloat(e.target.value);
                          setMultipleQuestions(newQuestions);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addMultipleQuestion}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Question
              </Button>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  onClick={handleMultipleUpload}
                  disabled={uploading || bulkUploadMutation.isPending}
                  className="flex-1"
                >
                  {uploading || bulkUploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading {multipleQuestions.length} questions...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload {multipleQuestions.length} Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Upload Mode */}
      {uploadMode === 'bulk' && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Upload via Excel/CSV</CardTitle>
            <CardDescription>Upload multiple questions at once</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Attribute Selector for Bulk Upload */}
            {selectedTopic && (
              <div className="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border-2 border-primary-200 dark:border-primary-700">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Select Attributes for All Questions *
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 font-normal">
                    (These will apply to all bulk uploaded questions)
                  </span>
                </label>
                
                {attributesLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading attributes...</span>
                  </div>
                ) : attributes && attributes.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {attributes.map((attribute: any) => (
                        <label
                          key={attribute.id}
                          className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAttributes.includes(attribute.id)}
                            onChange={() => handleAttributeToggle(attribute.id)}
                            className="w-4 h-4 text-primary-600 rounded"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{attribute.name}</span>
                        </label>
                      ))}
                    </div>
                    {selectedAttributes.length > 0 && (
                      <div className="mt-2 text-xs text-success-600 dark:text-success-400">
                        ✓ {selectedAttributes.length} attribute{selectedAttributes.length > 1 ? 's' : ''} selected
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    No attributes available. Please create attributes first.
                  </p>
                )}
              </div>
            )}

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
                  <div className="max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
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
                  disabled={bulkUploadMutation.isPending || selectedAttributes.length === 0}
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
                      {selectedAttributes.length === 0 && ' (Select Attributes First)'}
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Upload Status */}
            {uploadStatus.total > 0 && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Results</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>{' '}
                    <span className="font-medium">{uploadStatus.total}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-success-600 dark:text-success-400">Success:</span>{' '}
                    <span className="font-medium text-gray-900 dark:text-white">{uploadStatus.success}</span>
                  </p>
                  {uploadStatus.failed > 0 && (
                    <>
                      <p className="text-sm">
                        <span className="text-error-600 dark:text-error-400">Failed:</span>{' '}
                        <span className="font-medium text-gray-900 dark:text-white">{uploadStatus.failed}</span>
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