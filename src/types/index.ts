export interface Exam {
  id: string;
  name: string;
  description: string;
  exam_type: 'competitive' | 'school';
  created_at: string;
}

export interface Class {
  id: string;
  exam_id: string;
  name: string;
  class_number: number;
  section?: string;
  description: string;
  created_at: string;
}

export interface Subject {
  id: string;
  exam_id?: string;
  class_id?: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Topic {
  id: string;
  chapter_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Concept {
  id: string;
  topic_id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_more: boolean;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
}

// Tree view types
export interface TreeNode {
  id: string;
  name: string;
  type: 'exam' | 'class' | 'subject' | 'chapter' | 'topic' | 'concept';
  children?: TreeNode[];
  description?: string;
  exam_type?: 'competitive' | 'school';
}

// Question types
export interface Question {
  id: string;
  concept_id: string;
  content: string;
  question_image_url?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_a_image_url?: string;
  option_b_image_url?: string;
  option_c_image_url?: string;
  option_d_image_url?: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  difficulty: number; // 3PL parameter (0-1)
  discrimination: number; // 3PL parameter (0-3)
  guessing: number; // 3PL parameter (0-0.5)
  explanation?: string;
  tags?: string[];
  created_at: string;
}

// Add these after the Question types

export interface PYQQuestion {
  exam_name?: string;
  subject_name?: string;
  chapter_name?: string;
  topic_name?: string;
  concept_name?: string;
  year?: number;
  question_content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  difficulty: number;
  discrimination: number;
  guessing: number;
  explanation?: string;
  tags?: string;
}

export interface PYQUploadResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface ColumnMapping {
  exam_name: string;
  subject_name: string;
  chapter_name: string;
  topic_name: string;
  concept_name: string;
  year: string;
  question_content: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  difficulty: string;
  discrimination: string;
  guessing: string;
  explanation: string;
  tags: string;
  [key: string]: string | undefined;
}

export interface QuestionFormData {
  concept_id: string;
  content: string;
  question_image?: File;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_a_image?: File;
  option_b_image?: File;
  option_c_image?: File;
  option_d_image?: File;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  difficulty: number;
  discrimination: number;
  guessing: number;
  explanation?: string;
  tags?: string;
}