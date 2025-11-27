import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiagnosisService } from './diagnosis.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DiagnosisType, Language } from '@prisma/client';

@ApiTags('diagnosis')
@Controller('diagnosis')
export class DiagnosisController {
  constructor(private readonly diagnosisService: DiagnosisService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '診断一覧取得' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'type', required: false, enum: DiagnosisType })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  @ApiResponse({ status: 200, description: '診断一覧' })
  async findAll(
    @Query('category') category?: string,
    @Query('type') type?: DiagnosisType,
    @Query('language') language?: Language,
  ) {
    return this.diagnosisService.findAll({ category, type, language });
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: '診断詳細取得' })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  @ApiResponse({ status: 200, description: '診断詳細' })
  async findOne(@Param('id') id: string, @Query('language') language?: Language) {
    return this.diagnosisService.findById(id, language);
  }

  @Post(':id/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '診断セッション開始' })
  @ApiResponse({ status: 201, description: 'セッション作成完了' })
  async startSession(
    @CurrentUser('id') userId: string,
    @Param('id') diagnosisId: string,
  ) {
    return this.diagnosisService.startSession(userId, diagnosisId);
  }

  @Post('session/:sessionId/answer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '回答を送信' })
  @ApiResponse({ status: 200, description: '回答保存完了' })
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() body: {
      questionId: string;
      selectedOptionIds?: string[];
      textAnswer?: string;
      scaleValue?: number;
    },
  ) {
    const { questionId, ...answer } = body;
    return this.diagnosisService.submitAnswer(sessionId, questionId, answer);
  }

  @Post('session/:sessionId/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '診断を完了' })
  @ApiResponse({ status: 200, description: '診断完了・結果生成' })
  async completeSession(@Param('sessionId') sessionId: string) {
    return this.diagnosisService.completeSession(sessionId);
  }

  @Get('result/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '診断結果取得' })
  @ApiQuery({ name: 'language', required: false, enum: Language })
  @ApiResponse({ status: 200, description: '診断結果' })
  async getResult(@Param('id') id: string, @Query('language') language?: Language) {
    return this.diagnosisService.getResult(id, language);
  }

  @Get('user/results')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ユーザーの診断結果一覧' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiResponse({ status: 200, description: '診断結果一覧' })
  async getUserResults(
    @CurrentUser('id') userId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const skip = ((page || 1) - 1) * (pageSize || 20);
    return this.diagnosisService.getUserResults(userId, { skip, take: pageSize || 20 });
  }
}
