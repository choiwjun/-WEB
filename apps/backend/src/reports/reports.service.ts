import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ReportStatus, Language } from '@prisma/client';
import OpenAI from 'openai';

@Injectable()
export class ReportsService {
  private openai: OpenAI;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async generateReport(userId: string, diagnosisResultId: string, language: Language = Language.JA) {
    const result = await this.prisma.diagnosisResult.findUnique({
      where: { id: diagnosisResultId },
      include: {
        session: {
          include: {
            diagnosis: true,
            answers: {
              include: {
                question: true,
              },
            },
          },
        },
        user: true,
      },
    });

    if (!result) {
      throw new NotFoundException('診断結果が見つかりません');
    }

    // Create report record
    const report = await this.prisma.aIReport.create({
      data: {
        userId,
        diagnosisResultId,
        status: ReportStatus.GENERATING,
        title: `${result.session.diagnosis.title} - AIレポート`,
      },
    });

    // Generate report asynchronously
    this.generateReportContent(report.id, result, language).catch(console.error);

    return report;
  }

  private async generateReportContent(reportId: string, result: any, language: Language) {
    try {
      const prompt = this.buildPrompt(result, language);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(language),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('AIレスポンスが空です');
      }

      const parsedContent = JSON.parse(content);

      await this.prisma.aIReport.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.COMPLETED,
          summary: parsedContent.overview,
          content: parsedContent,
          htmlContent: this.generateHtmlReport(parsedContent),
          generatedAt: new Date(),
        },
      });
    } catch (error) {
      await this.prisma.aIReport.update({
        where: { id: reportId },
        data: {
          status: ReportStatus.FAILED,
          errorMessage: error.message,
        },
      });
    }
  }

  private getSystemPrompt(language: Language): string {
    const prompts = {
      JA: `あなたは心理カウンセリングの専門家です。診断結果に基づいて、専門的で深い洞察を含むレポートを作成してください。
以下のJSON形式で回答してください：
{
  "overview": "診断結果の概要",
  "detailedAnalysis": [{"title": "セクションタイトル", "content": "分析内容", "insights": ["洞察1", "洞察2"]}],
  "strengths": ["強み1", "強み2"],
  "areasForGrowth": ["成長領域1", "成長領域2"],
  "recommendations": [{"category": "カテゴリ", "title": "タイトル", "description": "説明", "actionItems": ["アクション1"], "priority": "high/medium/low"}],
  "personalizedAdvice": "パーソナライズされたアドバイス",
  "conclusion": "まとめ"
}`,
      KO: `당신은 심리 상담 전문가입니다. 진단 결과를 바탕으로 전문적이고 깊은 통찰력을 담은 보고서를 작성해주세요.
다음 JSON 형식으로 응답해주세요：...`,
      EN: `You are a psychology counseling expert. Create a professional report with deep insights based on the diagnosis results.
Please respond in the following JSON format：...`,
    };
    return prompts[language] || prompts.JA;
  }

  private buildPrompt(result: any, language: Language): string {
    return `
診断名: ${result.session.diagnosis.title}
総合スコア: ${result.totalScore}
結果タイプ: ${result.resultType}
結果タイトル: ${result.resultTitle}
カテゴリ別スコア: ${JSON.stringify(result.categoryScores)}

回答内容:
${result.session.answers
  .map((a: any) => `Q: ${a.question.questionText}\nA: ${a.selectedOptionIds?.join(', ') || a.textAnswer || a.scaleValue}`)
  .join('\n\n')}

上記の情報に基づいて、詳細なAIレポートを作成してください。
`;
  }

  private generateHtmlReport(content: any): string {
    return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; line-height: 1.8; color: #1D1F24; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px; }
    h1 { color: #1D1F24; border-bottom: 2px solid #C5B9A3; padding-bottom: 10px; }
    h2 { color: #1D1F24; margin-top: 30px; }
    .section { margin: 20px 0; padding: 20px; background: #F3EFE7; border-radius: 12px; }
    .strength { color: #47B881; }
    .growth { color: #7089A9; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>診断AIレポート</h1>
    <div class="section">
      <h2>概要</h2>
      <p>${content.overview}</p>
    </div>
    ${content.detailedAnalysis?.map((section: any) => `
      <div class="section">
        <h2>${section.title}</h2>
        <p>${section.content}</p>
        ${section.insights?.length ? `<ul>${section.insights.map((i: string) => `<li>${i}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
    <div class="section">
      <h2 class="strength">あなたの強み</h2>
      <ul>${content.strengths?.map((s: string) => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="section">
      <h2 class="growth">成長の機会</h2>
      <ul>${content.areasForGrowth?.map((a: string) => `<li>${a}</li>`).join('')}</ul>
    </div>
    <div class="section">
      <h2>パーソナライズされたアドバイス</h2>
      <p>${content.personalizedAdvice}</p>
    </div>
    <div class="section">
      <h2>まとめ</h2>
      <p>${content.conclusion}</p>
    </div>
  </div>
</body>
</html>
`;
  }

  async getReport(reportId: string) {
    const report = await this.prisma.aIReport.findUnique({
      where: { id: reportId },
      include: {
        diagnosisResult: {
          include: {
            session: {
              include: {
                diagnosis: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('レポートが見つかりません');
    }

    return report;
  }

  async getUserReports(userId: string, options: { skip?: number; take?: number }) {
    const { skip = 0, take = 20 } = options;

    const [reports, total] = await Promise.all([
      this.prisma.aIReport.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          diagnosisResult: {
            include: {
              session: {
                include: {
                  diagnosis: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.aIReport.count({ where: { userId } }),
    ]);

    return {
      reports,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async regenerateReport(reportId: string, userId: string) {
    const report = await this.prisma.aIReport.findUnique({
      where: { id: reportId },
      include: {
        diagnosisResult: {
          include: {
            session: {
              include: {
                diagnosis: true,
                answers: {
                  include: {
                    question: true,
                  },
                },
              },
            },
            user: true,
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('レポートが見つかりません');
    }

    // Update status to generating
    await this.prisma.aIReport.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.GENERATING,
        regeneratedCount: { increment: 1 },
        lastRegeneratedAt: new Date(),
      },
    });

    // Regenerate content
    this.generateReportContent(reportId, report.diagnosisResult, Language.JA).catch(console.error);

    return { message: 'レポート再生成を開始しました' };
  }
}
