import { StartExecutionCommand } from '@aws-sdk/client-sfn';
import { sfnClient } from '../config/aws.config';
import { VerificationResult, Candidate } from '../models';
import { logger } from '../utils/logger';
import { NotFoundError } from '../utils/errorHandler';
import env from '../config/env';

export interface VerificationRequest {
  candidateId: string;
  userId: string;
  verificationType: 'full' | 'employment' | 'education' | 'linkedin' | 'timeline';
  priority?: 'low' | 'normal' | 'high';
}

export class VerificationService {
  async startVerification(request: VerificationRequest): Promise<VerificationResult> {
    logger.info(`Starting verification for candidate ${request.candidateId}`);

    // Check if candidate exists
    const candidate = await Candidate.findByPk(request.candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    // Create verification result record
    const verification = await VerificationResult.create({
      candidateId: request.candidateId,
      userId: request.userId,
      verificationType: request.verificationType,
      status: 'pending',
      priority: request.priority || 'normal',
      riskScore: 0,
      findings: {},
      timeline: {},
      employment: {},
      education: {},
      linkedinVerification: {},
      documentAnalysis: {},
      flags: [],
      recommendations: [],
    });

    // Start Step Functions workflow if configured
    if (env.VERIFICATION_STATE_MACHINE_ARN) {
      try {
        const command = new StartExecutionCommand({
          stateMachineArn: env.VERIFICATION_STATE_MACHINE_ARN,
          input: JSON.stringify({
            verificationId: verification.id,
            candidateId: request.candidateId,
            verificationType: request.verificationType,
          }),
        });

        const response = await sfnClient.send(command);

        await verification.update({
          executionArn: response.executionArn,
          status: 'in_progress',
          startedAt: new Date(),
        });

        logger.info(`Step Functions execution started: ${response.executionArn}`);
      } catch (error) {
        logger.error('Failed to start Step Functions execution:', error);
        await verification.update({ status: 'failed' });
        throw error;
      }
    }

    return verification;
  }

  async getVerification(verificationId: string): Promise<VerificationResult> {
    const verification = await VerificationResult.findByPk(verificationId, {
      include: [
        { association: 'candidate' },
        { association: 'user' },
      ],
    });

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    return verification;
  }

  async listVerifications(userId: string, filters?: {
    status?: string;
    candidateId?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ rows: VerificationResult[]; count: number }> {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.candidateId) {
      where.candidateId = filters.candidateId;
    }

    const result = await VerificationResult.findAndCountAll({
      where,
      limit: filters?.limit || 20,
      offset: filters?.offset || 0,
      order: [['createdAt', 'DESC']],
      include: [{ association: 'candidate' }],
    });

    return result;
  }

  async updateVerificationStatus(
    verificationId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'failed',
    updates?: Partial<VerificationResult>
  ): Promise<VerificationResult> {
    const verification = await VerificationResult.findByPk(verificationId);

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    await verification.update({
      status,
      ...updates,
      ...(status === 'completed' && { completedAt: new Date() }),
    });

    logger.info(`Verification ${verificationId} status updated to ${status}`);

    return verification;
  }
}

export const verificationService = new VerificationService();
