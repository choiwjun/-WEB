/**
 * AIレポート関連の型定義
 */

export enum ReportStatus {
  PENDING = 'pending',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ReportFormat {
  HTML = 'html',
  PDF = 'pdf',
}

export interface AIReport {
  id: string;
  userId: string;
  diagnosisResultId: string;
  status: ReportStatus;
  title: string;
  summary?: string;
  content?: ReportContent;
  htmlContent?: string;
  pdfUrl?: string;
  generatedAt?: Date;
  regeneratedCount: number;
  lastRegeneratedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportContent {
  overview: string;
  detailedAnalysis: ReportSection[];
  strengths: string[];
  areasForGrowth: string[];
  recommendations: RecommendationSection[];
  personalizedAdvice: string;
  conclusion: string;
}

export interface ReportSection {
  title: string;
  content: string;
  score?: number;
  insights?: string[];
}

export interface RecommendationSection {
  category: string;
  title: string;
  description: string;
  actionItems: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface GenerateReportRequest {
  diagnosisResultId: string;
  format?: ReportFormat;
}

export interface RegenerateReportRequest {
  reportId: string;
  format?: ReportFormat;
}

export interface ReportTemplateVariables {
  userName: string;
  diagnosisTitle: string;
  completedDate: string;
  totalScore: number;
  resultType: string;
  categoryScores: Array<{
    category: string;
    score: number;
    percentage: number;
  }>;
  answers: Array<{
    question: string;
    answer: string;
  }>;
}

export interface AIGenerationConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}
