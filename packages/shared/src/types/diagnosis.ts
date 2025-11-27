/**
 * 診断関連の型定義
 */

export enum DiagnosisType {
  FREE = 'free',
  PAID = 'paid',
}

export enum DiagnosisCategory {
  PERSONALITY = 'personality',
  PSYCHOLOGY = 'psychology',
  CAREER = 'career',
  RELATIONSHIP = 'relationship',
  STRESS = 'stress',
  MENTAL_HEALTH = 'mental_health',
}

export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SCALE = 'scale',
  TEXT = 'text',
}

export interface Diagnosis {
  id: string;
  title: string;
  description: string;
  category: DiagnosisCategory;
  type: DiagnosisType;
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  thumbnailUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DiagnosisQuestion {
  id: string;
  diagnosisId: string;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[];
  order: number;
  isRequired: boolean;
  weight: number;
  categoryTag?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  score: number;
  order: number;
}

export interface DiagnosisAnswer {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  scaleValue?: number;
}

export interface DiagnosisSession {
  id: string;
  userId: string;
  diagnosisId: string;
  answers: DiagnosisAnswer[];
  currentQuestionIndex: number;
  status: DiagnosisSessionStatus;
  startedAt: Date;
  completedAt?: Date;
}

export enum DiagnosisSessionStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

export interface DiagnosisResult {
  id: string;
  sessionId: string;
  userId: string;
  diagnosisId: string;
  totalScore: number;
  categoryScores: CategoryScore[];
  resultType: string;
  resultTitle: string;
  resultDescription: string;
  recommendations: string[];
  createdAt: Date;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  description?: string;
}

export interface DiagnosisResultType {
  id: string;
  diagnosisId: string;
  typeName: string;
  minScore: number;
  maxScore: number;
  title: string;
  description: string;
  detailedAnalysis: string;
  recommendations: string[];
}
