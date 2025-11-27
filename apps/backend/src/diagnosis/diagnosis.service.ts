import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiagnosisType, DiagnosisSessionStatus, Language, Prisma } from '@prisma/client';

@Injectable()
export class DiagnosisService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: {
    category?: string;
    type?: DiagnosisType;
    language?: Language;
    skip?: number;
    take?: number;
  }) {
    const { category, type, language = Language.JA, skip = 0, take = 20 } = options;

    const where: Prisma.DiagnosisWhereInput = {
      isActive: true,
    };
    if (category) where.category = category as any;
    if (type) where.type = type;

    const diagnoses = await this.prisma.diagnosis.findMany({
      where,
      skip,
      take,
      orderBy: { order: 'asc' },
      include: {
        translations: {
          where: { language },
        },
      },
    });

    return diagnoses.map((d) => {
      const translation = d.translations[0];
      return {
        id: d.id,
        title: translation?.title || d.title,
        description: translation?.description || d.description,
        category: d.category,
        type: d.type,
        creditCost: d.creditCost,
        estimatedMinutes: d.estimatedMinutes,
        totalQuestions: d.totalQuestions,
        thumbnailUrl: d.thumbnailUrl,
      };
    });
  }

  async findById(id: string, language: Language = Language.JA) {
    const diagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
      include: {
        translations: {
          where: { language },
        },
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              include: {
                translations: {
                  where: { language },
                },
              },
            },
            translations: {
              where: { language },
            },
          },
        },
      },
    });

    if (!diagnosis) {
      throw new NotFoundException('診断が見つかりません');
    }

    const translation = diagnosis.translations[0];
    return {
      id: diagnosis.id,
      title: translation?.title || diagnosis.title,
      description: translation?.description || diagnosis.description,
      category: diagnosis.category,
      type: diagnosis.type,
      creditCost: diagnosis.creditCost,
      estimatedMinutes: diagnosis.estimatedMinutes,
      totalQuestions: diagnosis.totalQuestions,
      thumbnailUrl: diagnosis.thumbnailUrl,
      questions: diagnosis.questions.map((q) => {
        const qTranslation = q.translations[0];
        return {
          id: q.id,
          questionText: qTranslation?.questionText || q.questionText,
          questionType: q.questionType,
          order: q.order,
          isRequired: q.isRequired,
          options: q.options.map((o) => {
            const oTranslation = o.translations[0];
            return {
              id: o.id,
              text: oTranslation?.text || o.text,
              order: o.order,
            };
          }),
        };
      }),
    };
  }

  async startSession(userId: string, diagnosisId: string) {
    const diagnosis = await this.prisma.diagnosis.findUnique({
      where: { id: diagnosisId },
    });

    if (!diagnosis) {
      throw new NotFoundException('診断が見つかりません');
    }

    // Check for existing in-progress session
    const existingSession = await this.prisma.diagnosisSession.findFirst({
      where: {
        userId,
        diagnosisId,
        status: DiagnosisSessionStatus.IN_PROGRESS,
      },
    });

    if (existingSession) {
      return existingSession;
    }

    return this.prisma.diagnosisSession.create({
      data: {
        userId,
        diagnosisId,
        status: DiagnosisSessionStatus.IN_PROGRESS,
      },
    });
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: {
      selectedOptionIds?: string[];
      textAnswer?: string;
      scaleValue?: number;
    },
  ) {
    const session = await this.prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: {
        diagnosis: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('セッションが見つかりません');
    }

    if (session.status !== DiagnosisSessionStatus.IN_PROGRESS) {
      throw new BadRequestException('このセッションは既に完了しています');
    }

    // Save answer
    await this.prisma.diagnosisAnswer.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
      update: answer,
      create: {
        sessionId,
        questionId,
        ...answer,
      },
    });

    // Update current question index
    const currentIndex = session.diagnosis.questions.findIndex(
      (q) => q.id === questionId,
    );

    await this.prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: {
        currentQuestionIndex: currentIndex + 1,
      },
    });

    return { success: true };
  }

  async completeSession(sessionId: string) {
    const session = await this.prisma.diagnosisSession.findUnique({
      where: { id: sessionId },
      include: {
        diagnosis: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
            resultTypes: true,
          },
        },
        answers: true,
      },
    });

    if (!session) {
      throw new NotFoundException('セッションが見つかりません');
    }

    // Calculate score
    let totalScore = 0;
    const categoryScores: Record<string, { score: number; maxScore: number }> = {};

    for (const answer of session.answers) {
      const question = session.diagnosis.questions.find(
        (q) => q.id === answer.questionId,
      );
      if (!question) continue;

      const categoryTag = question.categoryTag || 'general';
      if (!categoryScores[categoryTag]) {
        categoryScores[categoryTag] = { score: 0, maxScore: 0 };
      }

      if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
        for (const optionId of answer.selectedOptionIds) {
          const option = question.options.find((o) => o.id === optionId);
          if (option) {
            const weightedScore = option.score * question.weight;
            totalScore += weightedScore;
            categoryScores[categoryTag].score += weightedScore;
          }
        }
      }

      if (answer.scaleValue) {
        const weightedScore = answer.scaleValue * question.weight;
        totalScore += weightedScore;
        categoryScores[categoryTag].score += weightedScore;
      }

      const maxOptionScore = Math.max(...question.options.map((o) => o.score), 0);
      categoryScores[categoryTag].maxScore += maxOptionScore * question.weight;
    }

    // Find matching result type
    const resultType = session.diagnosis.resultTypes.find(
      (rt) => totalScore >= rt.minScore && totalScore <= rt.maxScore,
    ) || session.diagnosis.resultTypes[0];

    // Create result
    const result = await this.prisma.diagnosisResult.create({
      data: {
        sessionId,
        userId: session.userId,
        diagnosisId: session.diagnosisId,
        totalScore: Math.round(totalScore),
        categoryScores,
        resultType: resultType?.typeName || 'default',
        resultTitle: resultType?.title || '診断結果',
        resultDescription: resultType?.description || '',
        recommendations: resultType?.recommendations || [],
      },
    });

    // Update session status
    await this.prisma.diagnosisSession.update({
      where: { id: sessionId },
      data: {
        status: DiagnosisSessionStatus.COMPLETED,
        completedAt: new Date(),
      },
    });

    return result;
  }

  async getResult(resultId: string, language: Language = Language.JA) {
    const result = await this.prisma.diagnosisResult.findUnique({
      where: { id: resultId },
      include: {
        session: {
          include: {
            diagnosis: {
              include: {
                translations: {
                  where: { language },
                },
              },
            },
            answers: {
              include: {
                question: {
                  include: {
                    translations: {
                      where: { language },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('診断結果が見つかりません');
    }

    return result;
  }

  async getUserResults(userId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = options;

    const [results, total] = await Promise.all([
      this.prisma.diagnosisResult.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          session: {
            include: {
              diagnosis: true,
            },
          },
        },
      }),
      this.prisma.diagnosisResult.count({ where: { userId } }),
    ]);

    return {
      results,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }
}
