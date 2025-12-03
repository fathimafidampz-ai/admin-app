import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from './constants';

// TEMPORARY: Mock mode for testing without backend
const USE_MOCK = true; // Set to false when backend is ready

// Mock data storage
const mockData = {
  exams: [] as any[],
  classes: [] as any[],
  subjects: [] as any[],
  chapters: [] as any[],
  topics: [] as any[],
  concepts: [] as any[],
  questions: [] as any[],
};

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock API functions
const mockApi = {
  createExam: async (data: any) => {
    const newExam = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.exams.push(newExam);
    return newExam;
  },
  getAllExams: async () => mockData.exams,
  
  // Classes
  createClass: async (data: any) => {
    const newClass = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.classes.push(newClass);
    return newClass;
  },
  getClasses: async (examId: string) => 
    mockData.classes.filter(c => c.exam_id === examId),
  
  createSubject: async (data: any) => {
    const newSubject = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.subjects.push(newSubject);
    return newSubject;
  },
  getSubjects: async (examId?: string, classId?: string) => {
    if (classId) {
      return mockData.subjects.filter(s => s.class_id === classId);
    }
    if (examId) {
      return mockData.subjects.filter(s => s.exam_id === examId);
    }
    return mockData.subjects;
  },
  
  createChapter: async (data: any) => {
    const newChapter = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.chapters.push(newChapter);
    return newChapter;
  },
  getChapters: async (subjectId: string) => 
    mockData.chapters.filter(c => c.subject_id === subjectId),
  
  createTopic: async (data: any) => {
    const newTopic = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.topics.push(newTopic);
    return newTopic;
  },
  getTopics: async (chapterId: string) => 
    mockData.topics.filter(t => t.chapter_id === chapterId),
  
  createConcept: async (data: any) => {
    const newConcept = { ...data, id: generateId(), created_at: new Date().toISOString() };
    mockData.concepts.push(newConcept);
    return newConcept;
  },
  getConcepts: async (topicId: string) => 
    mockData.concepts.filter(c => c.topic_id === topicId),
  
  // Build tree
  buildTree: async (examId?: string) => {
    const examsToProcess = examId 
      ? mockData.exams.filter(e => e.id === examId)
      : mockData.exams;
    
    return examsToProcess.map(exam => {
      const examNode: any = {
        id: exam.id,
        name: exam.name,
        type: 'exam',
        exam_type: exam.exam_type,
        description: exam.description,
        children: [],
      };

      if (exam.exam_type === 'school') {
        const classes = mockData.classes.filter(c => c.exam_id === exam.id);
        examNode.children = classes.map(cls => {
          const classNode: any = {
            id: cls.id,
            name: cls.name,
            type: 'class',
            description: cls.description,
            children: [],
          };

          const subjects = mockData.subjects.filter(s => s.class_id === cls.id);
          classNode.children = subjects.map(subject => buildSubjectTree(subject));
          
          return classNode;
        });
      } else {
        const subjects = mockData.subjects.filter(s => s.exam_id === exam.id);
        examNode.children = subjects.map(subject => buildSubjectTree(subject));
      }

      return examNode;
    });
  },

  // Statistics
  getStatistics: async () => {
    return {
      total_exams: mockData.exams.length,
      total_classes: mockData.classes.length,
      total_subjects: mockData.subjects.length,
      total_chapters: mockData.chapters.length,
      total_topics: mockData.topics.length,
      total_concepts: mockData.concepts.length,
      
      competitive_exams: mockData.exams.filter(e => e.exam_type === 'competitive').length,
      school_exams: mockData.exams.filter(e => e.exam_type === 'school').length,
      
      recent_activity: [
        ...mockData.concepts.map(c => ({ ...c, type: 'concept' })),
        ...mockData.topics.map(t => ({ ...t, type: 'topic' })),
        ...mockData.chapters.map(ch => ({ ...ch, type: 'chapter' })),
        ...mockData.subjects.map(s => ({ ...s, type: 'subject' })),
        ...mockData.classes.map(cl => ({ ...cl, type: 'class' })),
        ...mockData.exams.map(e => ({ ...e, type: 'exam' })),
      ]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10),
      
      subjects_by_exam: mockData.exams.map(exam => {
        const subjectCount = exam.exam_type === 'school'
          ? mockData.classes
              .filter(c => c.exam_id === exam.id)
              .reduce((count, cls) => 
                count + mockData.subjects.filter(s => s.class_id === cls.id).length, 0)
          : mockData.subjects.filter(s => s.exam_id === exam.id).length;
        
        return {
          exam_name: exam.name,
          exam_type: exam.exam_type,
          subject_count: subjectCount,
        };
      }),
      
      hierarchy_distribution: {
        exams: mockData.exams.length,
        classes: mockData.classes.length,
        subjects: mockData.subjects.length,
        chapters: mockData.chapters.length,
        topics: mockData.topics.length,
        concepts: mockData.concepts.length,
      },
    };
  },

  // Questions
  createQuestion: async (data: any) => {
    const newQuestion = { 
      ...data, 
      id: generateId(), 
      created_at: new Date().toISOString(),
      question_image_url: data.question_image ? `mock://question-${generateId()}.jpg` : undefined,
      option_a_image_url: data.option_a_image ? `mock://option-a-${generateId()}.jpg` : undefined,
      option_b_image_url: data.option_b_image ? `mock://option-b-${generateId()}.jpg` : undefined,
      option_c_image_url: data.option_c_image ? `mock://option-c-${generateId()}.jpg` : undefined,
      option_d_image_url: data.option_d_image ? `mock://option-d-${generateId()}.jpg` : undefined,
    };
    delete newQuestion.question_image;
    delete newQuestion.option_a_image;
    delete newQuestion.option_b_image;
    delete newQuestion.option_c_image;
    delete newQuestion.option_d_image;
    
    mockData.questions.push(newQuestion);
    return newQuestion;
  },

  getQuestions: async (conceptId?: string) => {
    if (conceptId) {
      return mockData.questions.filter(q => q.concept_id === conceptId);
    }
    return mockData.questions;
  },

  getQuestionById: async (id: string) => {
    return mockData.questions.find(q => q.id === id);
  },

  // Add this inside mockApi, after getQuestionById

  bulkCreateQuestions: async (questions: any[]) => {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as Array<{ row: number; error: string }>,
    };

    for (let i = 0; i < questions.length; i++) {
      try {
        const question = questions[i];
        
        // Validate required fields
        if (!question.concept_id) {
          results.errors.push({ row: i + 1, error: 'Missing concept_id' });
          results.failed++;
          continue;
        }
        
        if (!question.content || !question.option_a || !question.option_b || 
            !question.option_c || !question.option_d || !question.correct_answer) {
          results.errors.push({ row: i + 1, error: 'Missing required fields' });
          results.failed++;
          continue;
        }

        // Create question
        const newQuestion = {
          ...question,
          id: generateId(),
          created_at: new Date().toISOString(),
        };

        mockData.questions.push(newQuestion);
        results.success++;
      } catch (error) {
        results.errors.push({ row: i + 1, error: 'Failed to create question' });
        results.failed++;
      }
    }

    return results;
  },


// Add these inside mockApi, after bulkCreateQuestions

  updateQuestion: async (id: string, data: any) => {
    const index = mockData.questions.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Question not found');
    }
    
    const updatedQuestion = {
      ...mockData.questions[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    // Handle image updates
    if (data.question_image) {
      updatedQuestion.question_image_url = `mock://question-${generateId()}.jpg`;
    }
    if (data.option_a_image) {
      updatedQuestion.option_a_image_url = `mock://option-a-${generateId()}.jpg`;
    }
    if (data.option_b_image) {
      updatedQuestion.option_b_image_url = `mock://option-b-${generateId()}.jpg`;
    }
    if (data.option_c_image) {
      updatedQuestion.option_c_image_url = `mock://option-c-${generateId()}.jpg`;
    }
    if (data.option_d_image) {
      updatedQuestion.option_d_image_url = `mock://option-d-${generateId()}.jpg`;
    }
    
    // Remove File objects
    delete updatedQuestion.question_image;
    delete updatedQuestion.option_a_image;
    delete updatedQuestion.option_b_image;
    delete updatedQuestion.option_c_image;
    delete updatedQuestion.option_d_image;
    
    mockData.questions[index] = updatedQuestion;
    return updatedQuestion;
  },

  deleteQuestion: async (id: string) => {
    const index = mockData.questions.findIndex(q => q.id === id);
    if (index === -1) {
      throw new Error('Question not found');
    }
    
    mockData.questions.splice(index, 1);
    return { success: true, message: 'Question deleted successfully' };
  },  

};

// Helper to build subject tree
function buildSubjectTree(subject: any): any {
  const subjectNode: any = {
    id: subject.id,
    name: subject.name,
    type: 'subject',
    description: subject.description,
    children: [],
  };

  const chapters = mockData.chapters.filter(c => c.subject_id === subject.id);
  subjectNode.children = chapters.map(chapter => {
    const chapterNode: any = {
      id: chapter.id,
      name: chapter.name,
      type: 'chapter',
      description: chapter.description,
      children: [],
    };

    const topics = mockData.topics.filter(t => t.chapter_id === chapter.id);
    chapterNode.children = topics.map(topic => {
      const topicNode: any = {
        id: topic.id,
        name: topic.name,
        type: 'topic',
        description: topic.description,
        children: [],
      };

      const concepts = mockData.concepts.filter(c => c.topic_id === topic.id);
      topicNode.children = concepts.map(concept => ({
        id: concept.id,
        name: concept.name,
        type: 'concept',
        description: concept.description,
        children: [],
      }));

      return topicNode;
    });

    return chapterNode;
  });

  return subjectNode;
}

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const errorMessage = (error.response.data as any)?.error || 'An error occurred';
      console.error('API Error:', errorMessage);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Generic API request wrapper
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'GET', url }),
  
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'POST', url, data }),
  
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'PUT', url, data }),
  
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};

// Hierarchy API endpoints - with mock support
export const hierarchyApi = {
  // Exams
  getAllExams: () => 
    USE_MOCK ? Promise.resolve(mockApi.getAllExams()) : api.get<any[]>('/hierarchy/exams'),
  
  createExam: (data: { name: string; description: string; exam_type: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createExam(data)) : api.post<any>('/hierarchy/exams', data),
  
  // Classes (for school exams)
  getClasses: (examId: string) => 
    USE_MOCK ? Promise.resolve(mockApi.getClasses(examId)) : api.get<any[]>(`/hierarchy/classes?exam_id=${examId}`),
  
  createClass: (data: { exam_id: string; name: string; class_number: number; section?: string; description: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createClass(data)) : api.post<any>('/hierarchy/classes', data),
  
  // Subjects
  getSubjects: (examId?: string, classId?: string) => {
    if (USE_MOCK) {
      return Promise.resolve(mockApi.getSubjects(examId, classId));
    }
    const params = new URLSearchParams();
    if (examId) params.append('exam_id', examId);
    if (classId) params.append('class_id', classId);
    return api.get<any[]>(`/hierarchy/subjects?${params.toString()}`);
  },
  
  createSubject: (data: { exam_id?: string; class_id?: string; name: string; description: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createSubject(data)) : api.post<any>('/hierarchy/subjects', data),
  
  // Chapters
  getChapters: (subjectId: string) => 
    USE_MOCK ? Promise.resolve(mockApi.getChapters(subjectId)) : api.get<any[]>(`/hierarchy/chapters?subject_id=${subjectId}`),
  
  createChapter: (data: { subject_id: string; name: string; description: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createChapter(data)) : api.post<any>('/hierarchy/chapters', data),
  
  // Topics
  getTopics: (chapterId: string) => 
    USE_MOCK ? Promise.resolve(mockApi.getTopics(chapterId)) : api.get<any[]>(`/hierarchy/topics?chapter_id=${chapterId}`),
  
  createTopic: (data: { chapter_id: string; name: string; description: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createTopic(data)) : api.post<any>('/hierarchy/topics', data),
  
  // Concepts
  getConcepts: (topicId: string) => 
    USE_MOCK ? Promise.resolve(mockApi.getConcepts(topicId)) : api.get<any[]>(`/hierarchy/concepts?topic_id=${topicId}`),
  
  createConcept: (data: { topic_id: string; name: string; description: string }) =>
    USE_MOCK ? Promise.resolve(mockApi.createConcept(data)) : api.post<any>('/hierarchy/concepts', data),
  
  // Tree view
  getHierarchyTree: (examId?: string) => 
    USE_MOCK ? Promise.resolve(mockApi.buildTree(examId)) : api.get<any>(`/hierarchy/tree${examId ? `?exam_id=${examId}` : ''}`),
};

// Statistics API
export const statsApi = {
  getStatistics: () =>
    USE_MOCK ? Promise.resolve(mockApi.getStatistics()) : api.get<any>('/statistics'),
};

// Update the questionsApi to include bulkCreate

// Update the questionsApi to include update and delete

export const questionsApi = {
  create: (data: FormData) =>
    USE_MOCK 
      ? Promise.resolve(mockApi.createQuestion(Object.fromEntries(data))) 
      : api.post<any>('/questions', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
  
  getAll: (conceptId?: string) =>
    USE_MOCK 
      ? Promise.resolve(mockApi.getQuestions(conceptId))
      : api.get<any[]>(`/questions${conceptId ? `?concept_id=${conceptId}` : ''}`),
  
  getById: (id: string) =>
    USE_MOCK
      ? Promise.resolve(mockApi.getQuestionById(id))
      : api.get<any>(`/questions/${id}`),
  
  bulkCreate: (questions: any[]) =>
    USE_MOCK
      ? Promise.resolve(mockApi.bulkCreateQuestions(questions))
      : api.post<any>('/questions/bulk', { questions }),
  
  // Add these new functions
  update: (id: string, data: FormData) =>
    USE_MOCK
      ? Promise.resolve(mockApi.updateQuestion(id, Object.fromEntries(data)))
      : api.put<any>(`/questions/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }),
  
  delete: (id: string) =>
    USE_MOCK
      ? Promise.resolve(mockApi.deleteQuestion(id))
      : api.delete<any>(`/questions/${id}`),
};