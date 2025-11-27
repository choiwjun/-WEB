'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { 
  Clock, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Star, 
  Users, 
  Brain, 
  Target,
  Sparkles,
  Shield,
  Award,
  ChevronRight,
  Share2,
  Bookmark,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

interface DiagnosisDetail {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  type: 'FREE' | 'PAID';
  creditCost: number;
  estimatedMinutes: number;
  totalQuestions: number;
  completionCount?: number;
  rating?: number;
  totalReviews?: number;
  features?: string[];
  targetAudience?: string[];
  benefits?: string[];
  sampleQuestions?: string[];
  relatedDiagnoses?: { id: string; title: string; category: string }[];
  reviews?: { id: string; userName: string; rating: number; comment: string; date: string }[];
  questions: Question[];
}

interface Question {
  id: string;
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'SCALE' | 'TEXT';
  order: number;
  isRequired: boolean;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  order: number;
}

// Mock data for demonstration
const mockDiagnosesDetail: Record<string, DiagnosisDetail> = {
  'diag-001': {
    id: 'diag-001',
    title: '16タイプ性格診断',
    description: 'MBTI理論に基づいた16種類の性格タイプからあなたのタイプを診断します。',
    longDescription: `この診断は、カール・ユングの心理学的類型論をベースにした世界的に有名な性格診断です。

あなたの思考パターン、意思決定の方法、エネルギーの向け方、情報の処理方法などを分析し、16種類の性格タイプの中からあなたに最も適したタイプを診断します。

診断結果では、あなたの強み・弱み、適した職業、相性の良いタイプ、成長のためのアドバイスなど、詳細なレポートをお届けします。`,
    category: 'PERSONALITY',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 15,
    totalQuestions: 60,
    completionCount: 45678,
    rating: 4.8,
    totalReviews: 2341,
    features: [
      '心理学理論に基づいた科学的診断',
      '60問の質問で精密な分析',
      '詳細な性格タイプレポート',
      '強み・弱みの分析',
      '適職アドバイス',
    ],
    targetAudience: [
      '自己理解を深めたい方',
      '就職・転職を考えている方',
      '人間関係を改善したい方',
      'キャリアプランを立てたい方',
    ],
    benefits: [
      '自分の性格タイプを客観的に理解できる',
      '強みを活かしたキャリア選択ができる',
      '他者との相性を理解できる',
      'コミュニケーション力が向上する',
    ],
    sampleQuestions: [
      '大勢の人といるより、少人数の親しい友人といる方が心地よいですか？',
      '物事を決める時、論理的な分析を重視しますか、それとも感情や価値観を重視しますか？',
      '計画を立ててから行動する方ですか、それとも状況に応じて柔軟に対応する方ですか？',
    ],
    relatedDiagnoses: [
      { id: 'diag-007', title: 'エニアグラム性格診断', category: 'PERSONALITY' },
      { id: 'diag-002', title: 'キャリア適性診断Pro', category: 'CAREER' },
      { id: 'diag-004', title: '対人関係スタイル診断', category: 'RELATIONSHIP' },
    ],
    reviews: [
      { id: 'rev-001', userName: '山田太郎', rating: 5, comment: '自分の性格がよく理解できました。仕事選びの参考になりました！', date: '2024-03-15' },
      { id: 'rev-002', userName: '佐藤花子', rating: 5, comment: '質問が的確で、結果もとても当たっていました。友人にも勧めています。', date: '2024-03-10' },
      { id: 'rev-003', userName: '鈴木一郎', rating: 4, comment: '詳細なレポートが参考になりました。もう少し具体的なアドバイスがあれば完璧でした。', date: '2024-03-05' },
    ],
    questions: generateMockQuestions('personality', 10),
  },
  'diag-002': {
    id: 'diag-002',
    title: 'キャリア適性診断Pro',
    description: 'あなたの強み・価値観・興味から最適なキャリアパスを提案。',
    longDescription: `キャリア選択に悩んでいる方、転職を考えている方のための本格的な適性診断です。

この診断では、あなたの性格特性、スキル、価値観、興味関心を多角的に分析し、最も適したキャリアパスを提案します。

AIによる詳細な分析レポートでは、具体的な職種提案、必要なスキル、キャリアアップのロードマップまで、実践的なアドバイスをお届けします。`,
    category: 'CAREER',
    type: 'PAID',
    creditCost: 500,
    estimatedMinutes: 25,
    totalQuestions: 80,
    completionCount: 12340,
    rating: 4.9,
    totalReviews: 1256,
    features: [
      'AI分析による詳細レポート',
      '80問の総合診断',
      '具体的な職種マッチング',
      'キャリアロードマップ作成',
      '専門家監修のアドバイス',
    ],
    targetAudience: [
      '転職を考えている社会人',
      '就活中の学生',
      'キャリアチェンジを検討中の方',
      '自分の強みを知りたい方',
    ],
    benefits: [
      '自分に合った職種が明確になる',
      '転職・就活の方向性が定まる',
      '強みを活かしたキャリア形成ができる',
      '年収アップの可能性が広がる',
    ],
    sampleQuestions: [
      '新しいプロジェクトを任された時、どのように進めますか？',
      '仕事で最もやりがいを感じるのはどんな時ですか？',
      '理想の働き方はどのようなものですか？',
    ],
    relatedDiagnoses: [
      { id: 'diag-009', title: 'リーダーシップスタイル診断', category: 'CAREER' },
      { id: 'diag-001', title: '16タイプ性格診断', category: 'PERSONALITY' },
      { id: 'diag-008', title: 'ワークライフバランス診断', category: 'STRESS' },
    ],
    reviews: [
      { id: 'rev-004', userName: '田中美咲', rating: 5, comment: '転職活動に大いに役立ちました。提案された職種に実際に転職できました！', date: '2024-03-18' },
      { id: 'rev-005', userName: '高橋健一', rating: 5, comment: 'AIレポートがとても詳細で、具体的なアクションプランまで示してくれました。', date: '2024-03-12' },
      { id: 'rev-006', userName: '伊藤さくら', rating: 4, comment: '自分の強みが明確になりました。有料の価値は十分にあると思います。', date: '2024-03-08' },
    ],
    questions: generateMockQuestions('career', 10),
  },
  'diag-003': {
    id: 'diag-003',
    title: 'ストレスチェック診断',
    description: '現在のストレスレベルを測定し、その原因と対処法を分析。',
    longDescription: `厚生労働省のガイドラインに準拠したストレスチェック診断です。

仕事や日常生活でのストレス状態を多角的に評価し、あなたのストレスレベルと主な原因を特定します。

結果に基づいて、専門家監修のストレス対処法や、必要に応じて専門家への相談をおすすめします。定期的な受診で、メンタルヘルスの維持・改善に役立てください。`,
    category: 'STRESS',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 10,
    totalQuestions: 30,
    completionCount: 34521,
    rating: 4.7,
    totalReviews: 3456,
    features: [
      '厚生労働省ガイドライン準拠',
      '10分で完了',
      'ストレスレベルの数値化',
      '原因分析と対処法提案',
      '専門家への相談案内',
    ],
    targetAudience: [
      '仕事のストレスを感じている方',
      '心身の不調を感じている方',
      'メンタルヘルスを定期チェックしたい方',
      '職場の健康管理担当者',
    ],
    benefits: [
      'ストレス状態を客観的に把握できる',
      'ストレスの原因が明確になる',
      '適切な対処法がわかる',
      '早期のケアで深刻化を防げる',
    ],
    sampleQuestions: [
      '最近、仕事のことで頭がいっぱいになることがありますか？',
      '十分な睡眠が取れていますか？',
      '仕事や私生活で、自分でコントロールできないと感じることがありますか？',
    ],
    relatedDiagnoses: [
      { id: 'diag-008', title: 'ワークライフバランス診断', category: 'STRESS' },
      { id: 'diag-006', title: 'メンタルウェルネス診断', category: 'MENTAL_HEALTH' },
      { id: 'diag-012', title: '睡眠の質チェック', category: 'MENTAL_HEALTH' },
    ],
    reviews: [
      { id: 'rev-007', userName: '中村真一', rating: 5, comment: '自分のストレス状態を客観的に知ることができました。対処法も参考になりました。', date: '2024-03-20' },
      { id: 'rev-008', userName: '小林恵子', rating: 4, comment: '定期的に受けています。変化を追えるのが良いです。', date: '2024-03-14' },
      { id: 'rev-009', userName: '渡辺大輝', rating: 5, comment: '会社の健康診断より詳しい結果が出ました。おすすめです。', date: '2024-03-07' },
    ],
    questions: generateMockQuestions('stress', 10),
  },
  'diag-004': {
    id: 'diag-004',
    title: '対人関係スタイル診断',
    description: 'あなたのコミュニケーションパターンを分析し、人間関係改善のアドバイスを提供。',
    longDescription: `人間関係でお悩みの方のための、コミュニケーションスタイル診断です。

あなたの対人関係における傾向、コミュニケーションの特徴、強みと課題を明らかにします。

診断結果では、様々なタイプの人との効果的なコミュニケーション方法や、人間関係を改善するための具体的なアドバイスをお届けします。`,
    category: 'RELATIONSHIP',
    type: 'PAID',
    creditCost: 300,
    estimatedMinutes: 20,
    totalQuestions: 50,
    completionCount: 8765,
    rating: 4.6,
    totalReviews: 987,
    features: [
      'コミュニケーションタイプ分析',
      '強み・課題の明確化',
      'タイプ別対処法',
      '実践的なアドバイス',
      '相性診断機能',
    ],
    targetAudience: [
      '人間関係で悩んでいる方',
      'コミュニケーション力を向上させたい方',
      'チームワークを改善したいリーダー',
      'パートナーとの関係を良くしたい方',
    ],
    benefits: [
      '自分のコミュニケーションの癖がわかる',
      '苦手な人との付き合い方がわかる',
      '人間関係のストレスが軽減する',
      'より良い人間関係を築ける',
    ],
    sampleQuestions: [
      '意見が対立した時、どのように対処しますか？',
      '初対面の人と話す時、どのような気持ちになりますか？',
      '相手の話を聞く時、最も意識していることは何ですか？',
    ],
    relatedDiagnoses: [
      { id: 'diag-010', title: '恋愛傾向診断', category: 'RELATIONSHIP' },
      { id: 'diag-001', title: '16タイプ性格診断', category: 'PERSONALITY' },
      { id: 'diag-005', title: '心理的安全性チェック', category: 'PSYCHOLOGY' },
    ],
    reviews: [
      { id: 'rev-010', userName: '木村優子', rating: 5, comment: '職場の人間関係が改善しました！具体的なアドバイスが役立ちました。', date: '2024-03-16' },
      { id: 'rev-011', userName: '斉藤翔太', rating: 4, comment: '自分のコミュニケーションの癖に気づけました。', date: '2024-03-11' },
      { id: 'rev-012', userName: '松本美優', rating: 5, comment: 'パートナーとの関係改善に役立ちました。二人で受けるのもおすすめです。', date: '2024-03-04' },
    ],
    questions: generateMockQuestions('relationship', 10),
  },
};

// Generate mock questions for demonstration
function generateMockQuestions(type: string, count: number): Question[] {
  const questionTemplates: Record<string, { questions: string[]; options: string[][] }> = {
    personality: {
      questions: [
        '大勢の人と過ごすのと、少人数の親しい人と過ごすのでは、どちらが心地よいですか？',
        '新しいアイデアを考えるのと、実践的な解決策を見つけるのでは、どちらが得意ですか？',
        '物事を決める時、論理的な分析と感情・価値観のどちらを重視しますか？',
        '計画を立てて行動するのと、状況に応じて柔軟に対応するのでは、どちらが好きですか？',
        '人と話す時、相手の気持ちと話の内容、どちらに注目しますか？',
        '新しい環境に入った時、すぐに行動を起こしますか、それとも様子を見ますか？',
        '問題に直面した時、まず全体像を把握しますか、それとも詳細から確認しますか？',
        '締め切りがある時、早めに取り掛かりますか、それとも直前に集中して取り組みますか？',
        '人からのフィードバックをどのように受け止めますか？',
        '休日の過ごし方として理想的なのはどちらですか？',
      ],
      options: [
        ['大勢の人と過ごす方が好き', 'どちらかといえば大勢', 'どちらでもない', 'どちらかといえば少人数', '少人数の方が好き'],
        ['新しいアイデアが得意', 'どちらかといえばアイデア', 'どちらでもない', 'どちらかといえば実践', '実践的な解決が得意'],
        ['論理的分析を重視', 'どちらかといえば論理', 'どちらでもない', 'どちらかといえば感情', '感情・価値観を重視'],
        ['計画を立てる方が好き', 'どちらかといえば計画', 'どちらでもない', 'どちらかといえば柔軟', '柔軟に対応する方が好き'],
        ['相手の気持ちに注目', 'どちらかといえば気持ち', 'どちらでもない', 'どちらかといえば内容', '話の内容に注目'],
        ['すぐに行動を起こす', 'どちらかといえば行動', 'どちらでもない', 'どちらかといえば様子見', '様子を見る'],
        ['全体像から把握する', 'どちらかといえば全体', 'どちらでもない', 'どちらかといえば詳細', '詳細から確認する'],
        ['早めに取り掛かる', 'どちらかといえば早め', 'どちらでもない', 'どちらかといえば直前', '直前に集中する'],
        ['素直に受け止める', 'やや肯定的に受け止める', 'どちらでもない', 'やや批判的に感じる', '批判的に感じる'],
        ['アクティブに外出', 'どちらかといえば外出', 'どちらでもない', 'どちらかといえば自宅', '自宅でゆっくり'],
      ],
    },
    career: {
      questions: [
        '理想の職場環境はどのようなものですか？',
        '仕事で最もやりがいを感じる瞬間はどんな時ですか？',
        '新しいプロジェクトを任された時、どのように取り組みますか？',
        'チームで働くのと、一人で集中して働くのでは、どちらが好きですか？',
        '仕事とプライベートのバランスについて、どう考えますか？',
        'キャリアにおいて、最も重視することは何ですか？',
        'リーダーとして求められる時、どのように感じますか？',
        '新しいスキルを学ぶ機会があった時、どう感じますか？',
        '困難な課題に直面した時、どのように対処しますか？',
        '5年後の自分のキャリアをどのように想像しますか？',
      ],
      options: [
        ['自由で創造的な環境', '協力的なチーム環境', '体系的で安定した環境', '競争的で成果重視の環境', '自分のペースで働ける環境'],
        ['目標を達成した時', '人の役に立てた時', '新しいことを学んだ時', 'チームで成功した時', '認められた時'],
        ['すぐに計画を立てる', 'まず情報を集める', 'チームと相談する', '直感で進める', '過去の経験を参考にする'],
        ['チームで働くのが好き', 'どちらかといえばチーム', 'どちらでも良い', 'どちらかといえば一人', '一人で集中が好き'],
        ['仕事優先', 'やや仕事優先', 'バランス重視', 'ややプライベート優先', 'プライベート優先'],
        ['収入・安定性', '成長・スキルアップ', '社会貢献・やりがい', 'ワークライフバランス', '人間関係・職場環境'],
        ['積極的に引き受ける', 'やや前向き', 'どちらでもない', 'やや消極的', '避けたい'],
        ['とても楽しみ', 'やや楽しみ', 'どちらでもない', 'やや負担に感じる', '負担に感じる'],
        ['計画的に解決する', '人に相談する', '試行錯誤する', '一度離れて考える', '直感で判断する'],
        ['大きく成長している', '着実にスキルアップ', '今と同じくらい', '転職している', 'わからない'],
      ],
    },
    stress: {
      questions: [
        '最近、仕事のことで頭がいっぱいになることがありますか？',
        '十分な睡眠が取れていますか？',
        '食欲に変化はありますか？',
        '以前楽しめていたことに興味を持てなくなっていますか？',
        '集中力が続かないと感じることがありますか？',
        '人と会うのが億劫に感じることがありますか？',
        '将来のことを考えると不安になりますか？',
        '自分を責めてしまうことがありますか？',
        '身体的な疲労感を感じますか？',
        '仕事や生活で、自分でコントロールできないと感じることがありますか？',
      ],
      options: [
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['十分取れている', 'まあまあ取れている', '普通', 'やや不足', '全く取れていない'],
        ['変化なし', 'やや増えた', '普通', 'やや減った', '大きく減った'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
        ['全くない', 'あまりない', '時々ある', 'よくある', '常にある'],
      ],
    },
    relationship: {
      questions: [
        '意見が対立した時、どのように対処しますか？',
        '初対面の人と話す時、どのような気持ちになりますか？',
        '相手の話を聞く時、最も意識していることは何ですか？',
        '自分の意見を伝える時、どのように表現しますか？',
        '人間関係でストレスを感じる場面はどんな時ですか？',
        '友人や同僚との約束を守ることについて、どう考えますか？',
        '相手に頼みごとをする時、どのように感じますか？',
        '批判やフィードバックを受けた時、どのように反応しますか？',
        '人の悩みを聞いた時、どのように対応しますか？',
        '親しい人との距離感について、どう考えますか？',
      ],
      options: [
        ['自分の意見を主張する', '話し合いで解決', '相手に合わせる', '時間を置く', '第三者に相談'],
        ['とてもワクワクする', 'やや緊張するが楽しい', '普通', 'やや緊張する', 'とても緊張する'],
        ['相手の気持ち', '話の内容', '表情や態度', '自分の返答', '全体的な雰囲気'],
        ['直接的に伝える', 'やんわりと伝える', '状況による', '控えめに伝える', '言わないことが多い'],
        ['意見の対立', '期待に応えられない時', '誤解された時', '無視された時', '束縛された時'],
        ['必ず守る', 'できるだけ守る', '状況による', 'あまり気にしない', '柔軟に対応'],
        ['全く抵抗ない', 'あまり抵抗ない', '普通', 'やや抵抗ある', 'とても抵抗ある'],
        ['素直に受け入れる', '考えてから受け入れる', '防御的になる', '落ち込む', '反論する'],
        ['アドバイスする', '共感して聞く', '解決策を一緒に考える', 'ただ聞く', '話題を変える'],
        ['近い方が良い', 'やや近い方が良い', '適度な距離', 'やや離れた方が良い', '離れた方が良い'],
      ],
    },
  };

  const template = questionTemplates[type] || questionTemplates.personality;
  
  return template.questions.slice(0, count).map((questionText, index) => ({
    id: `q-${type}-${index + 1}`,
    questionText,
    questionType: 'SINGLE_CHOICE' as const,
    order: index + 1,
    isRequired: true,
    options: template.options[index].map((text, optIndex) => ({
      id: `opt-${type}-${index + 1}-${optIndex + 1}`,
      text,
      order: optIndex + 1,
    })),
  }));
}

// Default mock for unknown IDs
function getDefaultMockDiagnosis(id: string): DiagnosisDetail {
  return {
    id,
    title: '心理診断テスト',
    description: 'あなたの心理状態を分析する診断テストです。',
    longDescription: `この診断では、あなたの心理状態を多角的に分析し、自己理解を深めるお手伝いをします。

質問に正直に答えることで、より正確な結果が得られます。結果は保存され、いつでも確認することができます。`,
    category: 'PSYCHOLOGY',
    type: 'FREE',
    creditCost: 0,
    estimatedMinutes: 10,
    totalQuestions: 20,
    completionCount: 5000,
    rating: 4.5,
    totalReviews: 500,
    features: [
      '専門家監修の診断',
      '詳細な結果レポート',
      '改善アドバイス付き',
    ],
    targetAudience: [
      '自己理解を深めたい方',
      '心理状態をチェックしたい方',
    ],
    benefits: [
      '自分を客観的に見れる',
      '改善点がわかる',
    ],
    sampleQuestions: [
      '普段、どのような気持ちで過ごしていますか？',
      '困難に直面した時、どのように対処しますか？',
    ],
    relatedDiagnoses: [
      { id: 'diag-001', title: '16タイプ性格診断', category: 'PERSONALITY' },
      { id: 'diag-003', title: 'ストレスチェック診断', category: 'STRESS' },
    ],
    reviews: [
      { id: 'rev-default-1', userName: 'ユーザー', rating: 4, comment: '参考になりました。', date: '2024-03-01' },
    ],
    questions: generateMockQuestions('personality', 10),
  };
}

const categoryColors: Record<string, string> = {
  PERSONALITY: 'bg-blue-100 text-blue-700',
  PSYCHOLOGY: 'bg-purple-100 text-purple-700',
  CAREER: 'bg-green-100 text-green-700',
  RELATIONSHIP: 'bg-pink-100 text-pink-700',
  STRESS: 'bg-orange-100 text-orange-700',
  MENTAL_HEALTH: 'bg-teal-100 text-teal-700',
};

export default function DiagnosisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('diagnosis');
  const { isAuthenticated } = useAuthStore();

  const [diagnosis, setDiagnosis] = useState<DiagnosisDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      const diagnosisId = params.id as string;
      
      try {
        const data = await api.getDiagnosis(diagnosisId, locale.toUpperCase());
        if (data) {
          setDiagnosis(data);
        } else {
          // Use mock data
          const mockData = mockDiagnosesDetail[diagnosisId] || getDefaultMockDiagnosis(diagnosisId);
          setDiagnosis(mockData);
        }
      } catch (error) {
        console.error('Failed to fetch diagnosis, using mock data:', error);
        // Use mock data on API failure
        const mockData = mockDiagnosesDetail[diagnosisId] || getDefaultMockDiagnosis(diagnosisId);
        setDiagnosis(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosis();
  }, [params.id, locale]);

  const startDiagnosis = async () => {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login?redirect=/diagnosis/${params.id}`);
      return;
    }

    // For demo, just start without API
    setSessionId(`demo-session-${Date.now()}`);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitAnswer = async () => {
    if (!sessionId || !diagnosis) return;

    const currentQuestion = diagnosis.questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    if (currentQuestion.isRequired && !answer) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (currentQuestionIndex < diagnosis.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Show result
      setShowResult(true);
    }
    
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calm-beige">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-navy" />
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-calm-beige">
        <div className="text-center">
          <p className="text-warm-gray text-lg mb-4">診断が見つかりませんでした</p>
          <Button onClick={() => router.push(`/${locale}/diagnosis`)}>
            診断一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  // Show result page
  if (showResult) {
    return (
      <div className="min-h-screen bg-calm-beige py-12">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-deep-navy via-primary-600 to-sand-brown flex items-center justify-center">
                <div className="text-center text-white">
                  <Award className="w-16 h-16 mx-auto mb-4" />
                  <h1 className="text-h1">診断完了！</h1>
                </div>
              </div>
              <CardContent className="p-8 text-center">
                <h2 className="text-h2 text-deep-navy mb-4">
                  {diagnosis.title}の結果
                </h2>
                <p className="text-warm-gray mb-8">
                  あなたの回答を分析しました。以下は診断結果のサマリーです。
                </p>

                <div className="bg-calm-beige rounded-card p-6 mb-8">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-deep-navy">
                        {Object.keys(answers).length}
                      </p>
                      <p className="text-sm text-warm-gray">回答数</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">85%</p>
                      <p className="text-sm text-warm-gray">一貫性スコア</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-blue-600">A+</p>
                      <p className="text-sm text-warm-gray">総合評価</p>
                    </div>
                  </div>
                </div>

                <div className="text-left bg-white border border-gray-200 rounded-card p-6 mb-8">
                  <h3 className="font-semibold text-deep-navy mb-4">診断結果サマリー（デモ）</h3>
                  <ul className="space-y-2 text-warm-gray">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>あなたは論理的思考と共感力のバランスが取れたタイプです</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>計画性がありながらも柔軟性を持ち合わせています</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>人間関係においては信頼を大切にする傾向があります</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/${locale}/diagnosis`)}
                  >
                    診断一覧に戻る
                  </Button>
                  <Button onClick={() => router.push(`/${locale}/mypage`)}>
                    マイページで詳細を見る
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show diagnosis info before starting
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-calm-beige py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>

          {/* Main Info Card */}
          <Card className="overflow-hidden mb-8">
            <div className="h-64 bg-gradient-to-br from-deep-navy via-primary-600 to-sand-brown flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative text-center text-white px-4">
                <Badge className={cn('mb-4', categoryColors[diagnosis.category])}>
                  {t(`categories.${diagnosis.category.toLowerCase()}`)}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{diagnosis.title}</h1>
                <p className="text-white/80 max-w-2xl">{diagnosis.description}</p>
              </div>
            </div>
            
            <CardContent className="p-8">
              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <Badge variant={diagnosis.type === 'FREE' ? 'success' : 'info'} className="text-base px-4 py-2">
                  {diagnosis.type === 'FREE' ? '無料' : `${diagnosis.creditCost}クレジット`}
                </Badge>
                
                {diagnosis.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-deep-navy">{diagnosis.rating}</span>
                    <span className="text-warm-gray">({diagnosis.totalReviews?.toLocaleString()}件)</span>
                  </div>
                )}
                
                {diagnosis.completionCount && (
                  <div className="flex items-center gap-2 text-warm-gray">
                    <Users className="w-5 h-5" />
                    <span>{diagnosis.completionCount.toLocaleString()}人が受診</span>
                  </div>
                )}
              </div>

              {/* Time & Questions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <Clock className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">所要時間</p>
                  <p className="font-semibold text-deep-navy">約{diagnosis.estimatedMinutes}分</p>
                </div>
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <HelpCircle className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">設問数</p>
                  <p className="font-semibold text-deep-navy">{diagnosis.totalQuestions}問</p>
                </div>
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <Brain className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">分析方法</p>
                  <p className="font-semibold text-deep-navy">AI分析</p>
                </div>
                <div className="bg-calm-beige rounded-card p-4 text-center">
                  <Shield className="w-6 h-6 text-sand-brown mx-auto mb-2" />
                  <p className="text-sm text-warm-gray">監修</p>
                  <p className="font-semibold text-deep-navy">専門家</p>
                </div>
              </div>

              {/* Long Description */}
              {diagnosis.longDescription && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-deep-navy mb-4">この診断について</h3>
                  <p className="text-warm-gray whitespace-pre-line leading-relaxed">
                    {diagnosis.longDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              {diagnosis.features && diagnosis.features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-deep-navy mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-sand-brown" />
                    診断の特徴
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {diagnosis.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-warm-gray">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Target Audience */}
              {diagnosis.targetAudience && diagnosis.targetAudience.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-deep-navy mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-sand-brown" />
                    こんな方におすすめ
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {diagnosis.targetAudience.map((audience, index) => (
                      <li key={index} className="flex items-center gap-2 text-warm-gray">
                        <ChevronRight className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        {audience}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sample Questions */}
              {diagnosis.sampleQuestions && diagnosis.sampleQuestions.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-deep-navy mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-sand-brown" />
                    質問例
                  </h3>
                  <ul className="space-y-3">
                    {diagnosis.sampleQuestions.map((question, index) => (
                      <li key={index} className="bg-calm-beige rounded-card p-4 text-warm-gray">
                        Q{index + 1}. {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={startDiagnosis} className="flex-1" size="lg">
                  {t('detail.startButton')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  シェア
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  保存
                </Button>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-warm-gray text-center mt-4">
                  ※ 診断を受けるには{' '}
                  <button
                    onClick={() => router.push(`/${locale}/auth/login`)}
                    className="text-deep-navy underline hover:no-underline"
                  >
                    ログイン
                  </button>
                  が必要です
                </p>
              )}
            </CardContent>
          </Card>

          {/* Reviews Section */}
          {diagnosis.reviews && diagnosis.reviews.length > 0 && (
            <Card className="mb-8">
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-deep-navy mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-sand-brown" />
                  ユーザーレビュー
                </h3>
                <div className="space-y-4">
                  {diagnosis.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-medium">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-deep-navy">{review.userName}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'w-4 h-4',
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-warm-gray">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-warm-gray">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Diagnoses */}
          {diagnosis.relatedDiagnoses && diagnosis.relatedDiagnoses.length > 0 && (
            <Card>
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-deep-navy mb-6">関連する診断</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {diagnosis.relatedDiagnoses.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => router.push(`/${locale}/diagnosis/${related.id}`)}
                      className="text-left p-4 bg-calm-beige rounded-card hover:bg-sand-brown/20 transition-colors"
                    >
                      <Badge className={cn('mb-2', categoryColors[related.category])}>
                        {t(`categories.${related.category.toLowerCase()}`)}
                      </Badge>
                      <p className="font-medium text-deep-navy">{related.title}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show questions
  const currentQuestion = diagnosis.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / diagnosis.questions.length) * 100;

  return (
    <div className="min-h-screen bg-calm-beige py-12">
      <div className="container-narrow">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-warm-gray mb-2">
            <span>{currentQuestionIndex + 1} / {diagnosis.questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-sand-brown/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-deep-navy"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-sm text-warm-gray mb-4">
                  <span>質問 {currentQuestionIndex + 1}</span>
                  {currentQuestion.isRequired && (
                    <Badge variant="error" size="sm">必須</Badge>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-semibold text-deep-navy mb-8">
                  {currentQuestion.questionText}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentQuestion.questionType === 'MULTIPLE_CHOICE'
                      ? currentAnswer?.includes(option.id)
                      : currentAnswer === option.id;

                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (currentQuestion.questionType === 'MULTIPLE_CHOICE') {
                            const newAnswer = currentAnswer?.includes(option.id)
                              ? currentAnswer.filter((id: string) => id !== option.id)
                              : [...(currentAnswer || []), option.id];
                            handleAnswer(currentQuestion.id, newAnswer);
                          } else {
                            handleAnswer(currentQuestion.id, option.id);
                          }
                        }}
                        className={cn(
                          'w-full text-left p-4 rounded-card border-2 transition-all',
                          isSelected
                            ? 'border-deep-navy bg-deep-navy/5'
                            : 'border-sand-brown/30 hover:border-sand-brown'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0',
                              isSelected
                                ? 'border-deep-navy bg-deep-navy'
                                : 'border-sand-brown'
                            )}
                          >
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                          <span className={cn(isSelected ? 'text-deep-navy font-medium' : 'text-warm-gray')}>
                            {option.text}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            前の質問
          </Button>
          <Button
            onClick={submitAnswer}
            isLoading={isSubmitting}
            disabled={currentQuestion.isRequired && !currentAnswer}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {currentQuestionIndex < diagnosis.questions.length - 1 ? '次の質問' : '診断を完了する'}
          </Button>
        </div>
      </div>
    </div>
  );
}
