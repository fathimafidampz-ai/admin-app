import axios from 'axios';

// ✅ SET TO TRUE FOR MOCK MODE (Development without backend)
const USE_MOCK_API = true;

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Mock data
const MOCK_STATS = {
  total_exams: 5,
  total_subjects: 12,
  total_chapters: 45,
  total_concepts: 120,
  total_questions: 350,
  competitive_exams: 3,
  school_exams: 2,
  hierarchy_distribution: {
    exams: 5,
    classes: 8,
    subjects: 12,
    chapters: 45,
    topics: 89,
    concepts: 120,
  },
  recent_activity: [
    {
      id: '1',
      type: 'created',
      description: 'Created new exam: JEE Main 2024',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      user: 'You'
    },
    {
      id: '2',
      type: 'updated',
      description: 'Updated Physics chapter: Mechanics',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: 'You'
    },
    {
      id: '3',
      type: 'deleted',
      description: 'Deleted outdated questions',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user: 'You'
    }
  ]
};

const MOCK_QUESTIONS = [
  {
    id: '1',
    content: 'What is the capital of France?',
    option_a: 'London',
    option_b: 'Paris',
    option_c: 'Berlin',
    option_d: 'Madrid',
    correct_answer: 'B',
    difficulty: 0.2,
    discrimination: 1.5,
    guessing: 0.25,
    tags: ['geography', 'europe'],
    year: 2023,
    concept_id: '123'
  },
  {
    id: '2',
    content: 'Solve: 2x + 5 = 13',
    option_a: 'x = 4',
    option_b: 'x = 8',
    option_c: 'x = 6',
    option_d: 'x = 2',
    correct_answer: 'A',
    difficulty: 0.5,
    discrimination: 1.8,
    guessing: 0.25,
    tags: ['mathematics', 'algebra'],
    year: 2023,
    concept_id: '124'
  },
  {
    id: '3',
    content: 'What is photosynthesis?',
    option_a: 'Process of digestion',
    option_b: 'Process of respiration',
    option_c: 'Process of making food in plants',
    option_d: 'Process of cell division',
    correct_answer: 'C',
    difficulty: 0.3,
    discrimination: 1.6,
    guessing: 0.25,
    tags: ['biology', 'plants'],
    year: 2024,
    concept_id: '125'
  }
];

const MOCK_EXAMS = [
  {
    id: '1',
    name: 'JEE Main',
    description: 'Joint Entrance Examination',
    exam_type: 'competitive',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'NEET',
    description: 'National Eligibility Entrance Test',
    exam_type: 'competitive',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Class 10 CBSE',
    description: 'CBSE Board Examination',
    exam_type: 'school',
    created_at: new Date().toISOString()
  }
];

// ✅ HIERARCHY TREE MOCK DATA
const MOCK_HIERARCHY_TREE = [
  {
    id: '1',
    name: 'JEE Main',
    exam_type: 'competitive',
    description: 'Joint Entrance Examination',
    created_at: new Date().toISOString(),
    subjects: [
      {
        id: 's1',
        name: 'Physics',
        exam_id: '1',
        created_at: new Date().toISOString(),
        chapters: [
          {
            id: 'c1',
            name: 'Mechanics',
            subject_id: 's1',
            order_index: 1,
            created_at: new Date().toISOString(),
            topics: [
              {
                id: 't1',
                name: 'Newton Laws',
                chapter_id: 'c1',
                order_index: 1,
                created_at: new Date().toISOString(),
                concepts: [
                  { 
                    id: 'con1', 
                    name: 'First Law',
                    topic_id: 't1',
                    order_index: 1,
                    created_at: new Date().toISOString()
                  },
                  { 
                    id: 'con2', 
                    name: 'Second Law',
                    topic_id: 't1',
                    order_index: 2,
                    created_at: new Date().toISOString()
                  },
                ]
              }
            ]
          },
          {
            id: 'c2',
            name: 'Thermodynamics',
            subject_id: 's1',
            order_index: 2,
            created_at: new Date().toISOString(),
            topics: []
          }
        ]
      },
      {
        id: 's2',
        name: 'Mathematics',
        exam_id: '1',
        created_at: new Date().toISOString(),
        chapters: [
          {
            id: 'c3',
            name: 'Algebra',
            subject_id: 's2',
            order_index: 1,
            created_at: new Date().toISOString(),
            topics: [
              {
                id: 't2',
                name: 'Linear Equations',
                chapter_id: 'c3',
                order_index: 1,
                created_at: new Date().toISOString(),
                concepts: [
                  { 
                    id: 'con3', 
                    name: 'Basic Equations',
                    topic_id: 't2',
                    order_index: 1,
                    created_at: new Date().toISOString()
                  },
                ]
              }
            ]
          }
        ]
      },
      {
        id: 's3',
        name: 'Chemistry',
        exam_id: '1',
        created_at: new Date().toISOString(),
        chapters: []
      }
    ]
  },
  {
    id: '2',
    name: 'NEET',
    exam_type: 'competitive',
    description: 'Medical Entrance Exam',
    created_at: new Date().toISOString(),
    subjects: [
      {
        id: 's4',
        name: 'Biology',
        exam_id: '2',
        created_at: new Date().toISOString(),
        chapters: [
          {
            id: 'c4',
            name: 'Botany',
            subject_id: 's4',
            order_index: 1,
            created_at: new Date().toISOString(),
            topics: [
              {
                id: 't3',
                name: 'Photosynthesis',
                chapter_id: 'c4',
                order_index: 1,
                created_at: new Date().toISOString(),
                concepts: []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Class 10 CBSE',
    exam_type: 'school',
    description: 'CBSE Board Exam',
    created_at: new Date().toISOString(),
    classes: [
      {
        id: 'cl1',
        name: 'Class 10',
        exam_id: '3',
        class_number: '10',
        created_at: new Date().toISOString(),
        subjects: [
          {
            id: 's5',
            name: 'Science',
            class_id: 'cl1',
            exam_id: '3',
            created_at: new Date().toISOString(),
            chapters: []
          }
        ]
      }
    ]
  }
];

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTHENTICATION
// ============================================

export const authApi = {
  signUp: async (data: { email: string; password: string; name: string; organization?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  signIn: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  signOut: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// ============================================
// HIERARCHY
// ============================================

export const hierarchyApi = {
  // Get all exams
  getAllExams: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_EXAMS;
    }

    const response = await api.get('/exams');
    return response.data;
  },

  // Create exam
  createExam: async (exam: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newExam = {
        ...exam,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      MOCK_EXAMS.push(newExam);
      
      const hierarchyExam: any = {
        ...newExam,
      };
      
      if (exam.exam_type === 'school') {
        hierarchyExam.classes = [];
        hierarchyExam.subjects = undefined;
      } else {
        hierarchyExam.subjects = [];
        hierarchyExam.classes = undefined;
      }
      
      MOCK_HIERARCHY_TREE.push(hierarchyExam);
      
      console.log('✅ Exam created:', newExam);
      return newExam;
    }

    const response = await api.post('/exams', exam);
    return response.data;
  },

  // Create Class (for school exams)
  createClass: async (classData: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newClass = {
        ...classData,
        id: 'cl' + Date.now(),
        created_at: new Date().toISOString(),
        subjects: []
      };

      // Add to the correct exam in hierarchy tree
      const exam: any = MOCK_HIERARCHY_TREE.find(e => e.id === classData.exam_id);
      if (exam) {
        if (!exam.classes) {
          exam.classes = [];
        }
        exam.classes.push(newClass);
      }

      console.log('✅ Class created:', newClass);
      return newClass;
    }

    const response = await api.post('/classes', classData);
    return response.data;
  },

  // ✅ Get Classes (for school exams)
  getClasses: async (examId?: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allClasses: any[] = [];
      
      MOCK_HIERARCHY_TREE.forEach(exam => {
        if (!examId || exam.id === examId) {
          if (exam.classes) {
            allClasses.push(...exam.classes);
          }
        }
      });
      
      return allClasses;
    }

    const url = examId ? `/classes?exam_id=${examId}` : '/classes';
    const response = await api.get(url);
    return response.data;
  },

  // Get subjects
  // Get subjects
getSubjects: async (examId?: string, classId?: string) => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allSubjects: any[] = [];
    
    MOCK_HIERARCHY_TREE.forEach(exam => {
      if (!examId || exam.id === examId) {
        // Get subjects directly under exam (competitive)
        if (exam.subjects && !classId) {
          allSubjects.push(...exam.subjects);
        }
        // Get subjects under classes (school)
        if (exam.classes) {
          exam.classes.forEach((cls: any) => {
            if ((!classId || cls.id === classId) && cls.subjects) {
              allSubjects.push(...cls.subjects);
            }
          });
        }
      }
    });
    
    return allSubjects;
  }

  let url = '/subjects';
  const params: string[] = [];
  if (examId) params.push(`exam_id=${examId}`);
  if (classId) params.push(`class_id=${classId}`);
  if (params.length > 0) url += `?${params.join('&')}`;
  
  const response = await api.get(url);
  return response.data;
},

  // Create subject
  createSubject: async (subject: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSubject = {
        ...subject,
        id: 's' + Date.now(),
        created_at: new Date().toISOString(),
        chapters: []
      };

      // Add to the correct exam in hierarchy tree
      const exam: any = MOCK_HIERARCHY_TREE.find(e => e.id === subject.exam_id);
      if (exam) {
        if (subject.class_id) {
          // School exam - add to class
          const classItem = exam.classes?.find((c: any) => c.id === subject.class_id);
          if (classItem) {
            if (!classItem.subjects) {
              classItem.subjects = [];
            }
            classItem.subjects.push(newSubject);
          }
        } else {
          // Competitive exam - add directly to exam
          if (!exam.subjects) {
            exam.subjects = [];
          }
          exam.subjects.push(newSubject);
        }
      }

      console.log('✅ Subject created:', newSubject);
      console.log('📊 Updated hierarchy:', MOCK_HIERARCHY_TREE);
      
      return newSubject;
    }

    const response = await api.post('/subjects', subject);
    return response.data;
  },

  updateSubject: async (id: string, updates: any) => {
    const response = await api.put(`/subjects/${id}`, updates);
    return response.data;
  },

  deleteSubject: async (id: string) => {
    await api.delete(`/subjects/${id}`);
  },

  // Get chapters
  getChapters: async (subjectId?: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allChapters: any[] = [];
      
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        subjects.forEach((subj: any) => {
          if (!subjectId || subj.id === subjectId) {
            if (subj.chapters) allChapters.push(...subj.chapters);
          }
        });
      });
      
      return allChapters;
    }

    const url = subjectId ? `/chapters?subject_id=${subjectId}` : '/chapters';
    const response = await api.get(url);
    return response.data;
  },

  // Create chapter
  createChapter: async (chapter: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newChapter = {
        ...chapter,
        id: 'c' + Date.now(),
        created_at: new Date().toISOString(),
        topics: []
      };

      // Find and update the subject
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        const subject = subjects.find(s => s.id === chapter.subject_id);
        if (subject) {
          if (!subject.chapters) subject.chapters = [];
          subject.chapters.push(newChapter);
        }
      });

      console.log('✅ Chapter created:', newChapter);
      return newChapter;
    }

    const response = await api.post('/chapters', chapter);
    return response.data;
  },

  updateChapter: async (id: string, updates: any) => {
    const response = await api.put(`/chapters/${id}`, updates);
    return response.data;
  },

  deleteChapter: async (id: string) => {
    await api.delete(`/chapters/${id}`);
  },

  // Get topics
  getTopics: async (chapterId?: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allTopics: any[] = [];
      
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        subjects.forEach(subj => {
          subj.chapters?.forEach((chap: any) => {
            if (!chapterId || chap.id === chapterId) {
              if (chap.topics) allTopics.push(...chap.topics);
            }
          });
        });
      });
      
      return allTopics;
    }

    const url = chapterId ? `/topics?chapter_id=${chapterId}` : '/topics';
    const response = await api.get(url);
    return response.data;
  },

  // Create topic
  createTopic: async (topic: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newTopic = {
        ...topic,
        id: 't' + Date.now(),
        created_at: new Date().toISOString(),
        concepts: []
      };

      // Find and update the chapter
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        subjects.forEach(subj => {
          const chapter = subj.chapters?.find((c: any) => c.id === topic.chapter_id);
          if (chapter) {
            if (!chapter.topics) chapter.topics = [];
            chapter.topics.push(newTopic);
          }
        });
      });

      console.log('✅ Topic created:', newTopic);
      return newTopic;
    }

    const response = await api.post('/topics', topic);
    return response.data;
  },

  updateTopic: async (id: string, updates: any) => {
    const response = await api.put(`/topics/${id}`, updates);
    return response.data;
  },

  deleteTopic: async (id: string) => {
    await api.delete(`/topics/${id}`);
  },

  // Get concepts
  getConcepts: async (topicId?: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const allConcepts: any[] = [];
      
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        subjects.forEach(subj => {
          subj.chapters?.forEach((chap: any) => {
            chap.topics?.forEach((top: any) => {
              if (!topicId || top.id === topicId) {
                if (top.concepts) allConcepts.push(...top.concepts);
              }
            });
          });
        });
      });
      
      return allConcepts;
    }

    const url = topicId ? `/concepts?topic_id=${topicId}` : '/concepts';
    const response = await api.get(url);
    return response.data;
  },

  // Create concept
  createConcept: async (concept: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newConcept = {
        ...concept,
        id: 'con' + Date.now(),
        created_at: new Date().toISOString()
      };

      // Find and update the topic
      MOCK_HIERARCHY_TREE.forEach(exam => {
        const subjects = [...(exam.subjects || [])];
        exam.classes?.forEach((cls: any) => {
          if (cls.subjects) subjects.push(...cls.subjects);
        });
        
        subjects.forEach(subj => {
          subj.chapters?.forEach((chap: any) => {
            const topic = chap.topics?.find((t: any) => t.id === concept.topic_id);
            if (topic) {
              if (!topic.concepts) topic.concepts = [];
              topic.concepts.push(newConcept);
            }
          });
        });
      });

      console.log('✅ Concept created:', newConcept);
      return newConcept;
    }

    const response = await api.post('/concepts', concept);
    return response.data;
  },

  updateConcept: async (id: string, updates: any) => {
    const response = await api.put(`/concepts/${id}`, updates);
    return response.data;
  },

  deleteConcept: async (id: string) => {
    await api.delete(`/concepts/${id}`);
  },

  // Get hierarchy tree
  getHierarchyTree: async (examId?: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (examId) {
        const exam = MOCK_HIERARCHY_TREE.find(e => e.id === examId);
        return exam ? [exam] : [];
      }
      
      console.log('📊 Hierarchy tree data:', MOCK_HIERARCHY_TREE);
      return MOCK_HIERARCHY_TREE;
    }

    const url = examId ? `/hierarchy/tree?exam_id=${examId}` : '/hierarchy/tree';
    const response = await api.get(url);
    return response.data;
  },
};

// ============================================
// QUESTIONS
// ============================================

export const questionsApi = {
  getAll: async (filters?: { concept_id?: string; tags?: string[] }) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_QUESTIONS;
    }

    const response = await api.get('/questions', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const question = MOCK_QUESTIONS.find(q => q.id === id);
      if (!question) throw new Error('Question not found');
      return question;
    }

    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  create: async (question: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newQuestion = { ...question, id: Date.now().toString() };
      MOCK_QUESTIONS.push(newQuestion);
      return newQuestion;
    }

    const response = await api.post('/questions', question);
    return response.data;
  },

  update: async (id: string, updates: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = MOCK_QUESTIONS.findIndex(q => q.id === id);
      if (index !== -1) {
        MOCK_QUESTIONS[index] = { ...MOCK_QUESTIONS[index], ...updates };
        return MOCK_QUESTIONS[index];
      }
      throw new Error('Question not found');
    }

    const response = await api.put(`/questions/${id}`, updates);
    return response.data;
  },

  delete: async (id: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = MOCK_QUESTIONS.findIndex(q => q.id === id);
      if (index !== -1) {
        MOCK_QUESTIONS.splice(index, 1);
      }
      return;
    }

    await api.delete(`/questions/${id}`);
  },

  bulkCreate: async (questions: any[]) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const newQuestions = questions.map(q => ({
        ...q,
        id: Date.now().toString() + Math.random()
      }));
      MOCK_QUESTIONS.push(...newQuestions);
      return newQuestions;
    }

    const response = await api.post('/questions/bulk', { questions });
    return response.data;
  },
};

// ============================================
// STATISTICS
// ============================================

export const statsApi = {
  getStatistics: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_STATS;
    }

    const response = await api.get('/stats');
    return response.data;
  },
};

// ============================================
// IMAGE UPLOAD
// ============================================

export const uploadImage = async (file: File, type: string = 'question') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

// ============================================
// RESOURCES
// ============================================

export const resourcesApi = {
  getAll: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [];
    }
    const response = await api.get('/resources');
    return response.data;
  },

  upload: async (file: File | null, metadata: any) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Date.now().toString(),
        ...metadata,
        file_url: file ? URL.createObjectURL(file) : undefined,
        file_size: file?.size,
        created_at: new Date().toISOString(),
      };
    }

    if (file) {
      // Upload with file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await api.post('/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Create resource without file (external link)
      const response = await api.post('/resources', metadata);
      return response.data;
    }
  },

  delete: async (id: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return;
    }
    await api.delete(`/resources/${id}`);
  },
};

// Export axios instance for custom requests
export default api;