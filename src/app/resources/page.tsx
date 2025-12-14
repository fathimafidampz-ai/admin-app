'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Upload, FileText, Video, Image as ImageIcon, File, X, CheckCircle, 
  Loader2, Download, Eye, Trash2, Search, Filter, BookOpen, Link as LinkIcon,
  ExternalLink, Calendar, User, Network, Box, Cpu
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi, hierarchyApi } from '@/lib/api';

type ResourceType = 'pdf' | 'video' | 'image' | 'document' | '3d' | 'virtual_lab';

interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: ResourceType;
  file_url?: string;
  external_url?: string;
  file_size?: number;
  concept_id: string;
  concept_name?: string;
  tags?: string[];
  created_by?: string;
  created_at: string;
  updated_at?: string;
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
  concept_id?: string;
  concept_name?: string;
}

export default function ResourcesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ CHECK AUTHENTICATION
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const [selectedType, setSelectedType] = useState<ResourceType>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<ResourceType | 'all'>('all');
  const [tagInput, setTagInput] = useState('');

  // Hierarchy state
  const [hierarchyPath, setHierarchyPath] = useState<HierarchyPath>({
    exam_id: '',
    exam_name: '',
    exam_type: '',
  });

  const [selectedExam, setSelectedExam] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedConcept, setSelectedConcept] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    external_url: '',
    tags: [] as string[],
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

  const { data: concepts } = useQuery({
    queryKey: ['concepts', selectedTopic],
    queryFn: () => hierarchyApi.getConcepts(selectedTopic),
    enabled: !!selectedTopic,
  });

  // Fetch existing resources
  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: () => resourcesApi.getAll(),
  });

  const uploadMutation = useMutation({
    mutationFn: (data: { file?: File; metadata: any }) => {
      return resourcesApi.upload(data.file || null, data.metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      resetForm();
      alert('Resource uploaded successfully!');
    },
    onError: (error) => {
      console.error('Upload error:', error);
      alert('Failed to upload resource. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resourcesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      alert('Resource deleted successfully!');
    },
  });

  const resourceTypes = [
    { value: 'pdf', label: 'PDF Document', icon: FileText, color: 'text-red-600 dark:text-red-400', accept: '.pdf' },
    { value: 'video', label: 'Video', icon: Video, color: 'text-purple-600 dark:text-purple-400', accept: 'video/*,.mp4,.avi,.mov,.wmv,.mkv' },
    { value: 'image', label: 'Image', icon: ImageIcon, color: 'text-blue-600 dark:text-blue-400', accept: 'image/*,.png,.jpg,.jpeg,.gif,.webp' },
    { value: 'document', label: 'Document', icon: File, color: 'text-green-600 dark:text-green-400', accept: '.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx' },
    { value: '3d', label: '3D Model', icon: Box, color: 'text-orange-600 dark:text-orange-400', accept: '.obj,.fbx,.gltf,.glb,.blend' },
    { value: 'virtual_lab', label: 'Virtual Lab', icon: Cpu, color: 'text-cyan-600 dark:text-cyan-400', accept: '.html,.zip' },
  ];

  const handleExamChange = (examId: string) => {
    const exam = exams?.find((e: any) => e.id === examId);
    setSelectedExam(examId);
    setSelectedClass('');
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedTopic('');
    setSelectedConcept('');
    
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
    setSelectedConcept('');
    
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
    setSelectedConcept('');
    
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
    setSelectedConcept('');
    
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
    setSelectedConcept('');
    
    if (topic) {
      setHierarchyPath(prev => ({
        ...prev,
        topic_id: topic.id,
        topic_name: topic.name,
      }));
    }
  };

  const handleConceptChange = (conceptId: string) => {
    const concept = concepts?.find((c: any) => c.id === conceptId);
    setSelectedConcept(conceptId);
    
    if (concept) {
      setHierarchyPath(prev => ({
        ...prev,
        concept_id: concept.id,
        concept_name: concept.name,
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Generate preview for images
      if (selectedType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleUpload = async () => {
    // Validation
    if (!formData.title || !selectedConcept) {
      alert('Please fill in title and select a concept');
      return;
    }

    if (!selectedFile && !formData.external_url) {
      alert('Please select a file or enter external URL');
      return;
    }

    const metadata = {
      title: formData.title,
      description: formData.description,
      resource_type: selectedType,
      concept_id: selectedConcept,
      external_url: formData.external_url || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    };

    uploadMutation.mutate({ 
      file: selectedFile || undefined, 
      metadata 
    });
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFormData({ 
      title: '', 
      description: '', 
      external_url: '',
      tags: [] 
    });
    setTagInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getResourceIcon = (type: ResourceType) => {
    const resourceType = resourceTypes.find(rt => rt.value === type);
    return resourceType ? resourceType.icon : File;
  };

  const getResourceColor = (type: ResourceType) => {
    const resourceType = resourceTypes.find(rt => rt.value === type);
    return resourceType ? resourceType.color : 'text-gray-600';
  };

  // Filter resources
  const filteredResources = resources?.filter((resource: Resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || resource.resource_type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  // Get statistics
  const stats = {
    total: resources?.length || 0,
    pdf: resources?.filter((r: Resource) => r.resource_type === 'pdf').length || 0,
    video: resources?.filter((r: Resource) => r.resource_type === 'video').length || 0,
    image: resources?.filter((r: Resource) => r.resource_type === 'image').length || 0,
    document: resources?.filter((r: Resource) => r.resource_type === 'document').length || 0,
    '3d': resources?.filter((r: Resource) => r.resource_type === '3d').length || 0,
    virtual_lab: resources?.filter((r: Resource) => r.resource_type === 'virtual_lab').length || 0,
  };

  return (
    <AppLayout
      title="Upload Resources"
      subtitle="Upload PDFs, videos, images, documents, 3D models, and virtual labs"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-red-600 dark:text-red-400 mb-1">PDFs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pdf}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Videos</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.video}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Images</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.image}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Docs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.document}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">3D</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats['3d']}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-cyan-600 dark:text-cyan-400 mb-1">V-Labs</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.virtual_lab}</p>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchy Selector */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <CardTitle>Select Hierarchy Path</CardTitle>
          </div>
          <CardDescription>Navigate through the hierarchy to select where to add resources</CardDescription>
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
                {hierarchyPath.concept_name && (
                  <>
                    <span>→</span>
                    <span className="font-semibold text-success-700 dark:text-success-300">{hierarchyPath.concept_name}</span>
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

      {/* Upload Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload New Resource</CardTitle>
          <CardDescription>Upload files or add external links</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Resource Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Resource Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {resourceTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedType(type.value as ResourceType);
                      handleRemoveFile();
                      setFormData({ ...formData, external_url: '' });
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${type.color}`} />
                    <p className="text-xs font-medium text-gray-900 dark:text-white text-center">
                      {type.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <Input
                placeholder="Enter resource title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                External URL (Optional)
              </label>
              <Input
                placeholder="https://example.com/resource"
                value={formData.external_url}
                onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                type="url"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter resource description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (Optional)
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button variant="outline" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload File {formData.external_url ? '(Optional)' : '*'}
            </label>
            
            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Click to upload {resourceTypes.find(rt => rt.value === selectedType)?.label.toLowerCase()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Accepted formats: {resourceTypes.find(rt => rt.value === selectedType)?.accept}
                </p>
              </div>
            ) : (
              <div className="border-2 border-success-300 dark:border-success-700 bg-success-50 dark:bg-success-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-success-600 dark:text-success-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-error-600 dark:text-error-400" />
                  </button>
                </div>

                {/* Image Preview */}
                {filePreview && selectedType === 'image' && (
                  <div className="mt-4">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept={resourceTypes.find(rt => rt.value === selectedType)?.accept}
              className="hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={uploadMutation.isPending || !selectedConcept}
              className="flex-1"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources List with Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Resources</CardTitle>
              <CardDescription>Manage your educational resources</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as ResourceType | 'all')}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Types</option>
              {resourceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              {searchQuery || filterType !== 'all' ? 'No resources match your filters' : 'No resources uploaded yet'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource: Resource) => {
                const Icon = getResourceIcon(resource.resource_type);
                const colorClass = getResourceColor(resource.resource_type);

                return (
                  <div
                    key={resource.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className={`w-8 h-8 ${colorClass} flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {resource.resource_type.replace('_', ' ')}
                        </p>
                        {resource.file_size && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatFileSize(resource.file_size)}
                          </p>
                        )}
                      </div>
                    </div>

                    {resource.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {resource.description}
                      </p>
                    )}

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {resource.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded">
                            +{resource.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Created Date */}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(resource.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const url = resource.external_url || resource.file_url;
                          window.open(url, '_blank');
                        }}
                        className="flex-1"
                      >
                        {resource.external_url ? (
                          <>
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Open
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => deleteMutation.mutate(resource.id)}
                        className="text-error-600 dark:text-error-400 border-error-200 dark:border-error-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}