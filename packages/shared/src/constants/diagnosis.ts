/**
 * 診断関連の定数
 */

export const DIAGNOSIS_CATEGORIES = {
  personality: {
    key: 'personality',
    defaultName: '性格診断',
    icon: 'user',
    color: '#7089A9',
  },
  psychology: {
    key: 'psychology',
    defaultName: '心理診断',
    icon: 'brain',
    color: '#47B881',
  },
  career: {
    key: 'career',
    defaultName: 'キャリア診断',
    icon: 'briefcase',
    color: '#F7C948',
  },
  relationship: {
    key: 'relationship',
    defaultName: '人間関係診断',
    icon: 'heart',
    color: '#EC4C47',
  },
  stress: {
    key: 'stress',
    defaultName: 'ストレス診断',
    icon: 'activity',
    color: '#C5B9A3',
  },
  mental_health: {
    key: 'mental_health',
    defaultName: 'メンタルヘルス診断',
    icon: 'shield',
    color: '#1D1F24',
  },
} as const;

export const SCALE_OPTIONS = {
  5: [
    { value: 1, label: '全くそう思わない' },
    { value: 2, label: 'あまりそう思わない' },
    { value: 3, label: 'どちらとも言えない' },
    { value: 4, label: 'ややそう思う' },
    { value: 5, label: '非常にそう思う' },
  ],
  7: [
    { value: 1, label: '全くそう思わない' },
    { value: 2, label: 'そう思わない' },
    { value: 3, label: 'あまりそう思わない' },
    { value: 4, label: 'どちらとも言えない' },
    { value: 5, label: 'ややそう思う' },
    { value: 6, label: 'そう思う' },
    { value: 7, label: '非常にそう思う' },
  ],
} as const;

export const DEFAULT_CREDIT_COSTS = {
  free_diagnosis: 0,
  basic_diagnosis: 100,
  advanced_diagnosis: 300,
  premium_diagnosis: 500,
  chat_session: 200,
  ai_report: 150,
} as const;

export const DIAGNOSIS_TIME_ESTIMATES = {
  short: { min: 5, max: 10, questions: 20 },
  medium: { min: 10, max: 20, questions: 40 },
  long: { min: 20, max: 30, questions: 60 },
} as const;
