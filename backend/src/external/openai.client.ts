import { openai, OPENAI_CONFIG } from '../config/openai.config';
import { logger } from '../utils/logger';
import { ExternalServiceError } from '../utils/errorHandler';

export interface ResumeData {
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  workExperience: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    responsibilities?: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
  }>;
  skills?: string[];
  certifications?: string[];
}

export interface TimelineAnalysisResult {
  gaps: Array<{
    start: string;
    end: string;
    durationDays: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  overlaps: Array<{
    position1: string;
    position2: string;
    overlapDays: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  redFlags: string[];
  riskScore: number;
}

export class OpenAIClient {
  async parseResume(resumeText: string): Promise<ResumeData> {
    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        temperature: OPENAI_CONFIG.temperature,
        messages: [
          {
            role: 'system',
            content: OPENAI_CONFIG.prompts.resumeParsing,
          },
          {
            role: 'user',
            content: `Parse the following resume:\n\n${resumeText}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content);
      logger.info('Resume parsed successfully');
      return parsed;
    } catch (error) {
      logger.error('Failed to parse resume with OpenAI:', error);
      throw new ExternalServiceError(
        'Failed to parse resume',
        'OpenAI'
      );
    }
  }

  async analyzeTimeline(timeline: any): Promise<TimelineAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        temperature: OPENAI_CONFIG.temperature,
        messages: [
          {
            role: 'system',
            content: OPENAI_CONFIG.prompts.timelineAnalysis,
          },
          {
            role: 'user',
            content: `Analyze the following timeline:\n\n${JSON.stringify(timeline, null, 2)}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const analysis = JSON.parse(content);
      logger.info('Timeline analyzed successfully');
      return analysis;
    } catch (error) {
      logger.error('Failed to analyze timeline with OpenAI:', error);
      throw new ExternalServiceError(
        'Failed to analyze timeline',
        'OpenAI'
      );
    }
  }

  async verifyCompany(
    companyName: string,
    employmentDates: { start: string; end?: string }
  ): Promise<{
    exists: boolean;
    legitimate: boolean;
    redFlags: string[];
    confidence: number;
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        temperature: OPENAI_CONFIG.temperature,
        messages: [
          {
            role: 'system',
            content: OPENAI_CONFIG.prompts.companyVerification,
          },
          {
            role: 'user',
            content: `Verify company: ${companyName}\nEmployment dates: ${employmentDates.start} to ${employmentDates.end || 'present'}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const verification = JSON.parse(content);
      logger.info(`Company verification completed for ${companyName}`);
      return verification;
    } catch (error) {
      logger.error('Failed to verify company with OpenAI:', error);
      throw new ExternalServiceError(
        'Failed to verify company',
        'OpenAI'
      );
    }
  }

  async verifyEducation(
    institution: string,
    degree: string,
    dates: { start: string; end?: string }
  ): Promise<{
    accredited: boolean;
    degreeExists: boolean;
    redFlags: string[];
    confidence: number;
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.model,
        temperature: OPENAI_CONFIG.temperature,
        messages: [
          {
            role: 'system',
            content: OPENAI_CONFIG.prompts.educationVerification,
          },
          {
            role: 'user',
            content: `Verify education: ${institution}\nDegree: ${degree}\nDates: ${dates.start} to ${dates.end || 'present'}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const verification = JSON.parse(content);
      logger.info(`Education verification completed for ${institution}`);
      return verification;
    } catch (error) {
      logger.error('Failed to verify education with OpenAI:', error);
      throw new ExternalServiceError(
        'Failed to verify education',
        'OpenAI'
      );
    }
  }
}

export const openaiClient = new OpenAIClient();
