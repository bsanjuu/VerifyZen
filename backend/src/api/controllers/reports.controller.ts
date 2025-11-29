import { Request, Response, NextFunction } from 'express';
import { VerificationResult, Candidate } from '../../models';
import { ValidationError, NotFoundError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export async function generateReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { verificationId } = req.params;

    const verification = await VerificationResult.findOne({
      where: { id: verificationId, userId: req.userId },
      include: [
        {
          model: Candidate,
          as: 'candidate',
        },
      ],
    });

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    if (verification.status !== 'completed') {
      throw new ValidationError('Verification must be completed before generating a report');
    }

    // In a real implementation, this would generate a PDF report
    // For now, we'll just return the verification data formatted as a report
    const report = {
      id: verification.id,
      candidate: {
        name: `${verification.candidate?.firstName} ${verification.candidate?.lastName}`,
        email: verification.candidate?.email,
      },
      verificationType: verification.verificationType,
      riskScore: verification.riskScore,
      status: verification.status,
      findings: verification.findings,
      timeline: verification.timeline,
      employment: verification.employment,
      education: verification.education,
      linkedinVerification: verification.linkedinVerification,
      documentAnalysis: verification.documentAnalysis,
      flags: verification.flags,
      recommendations: verification.recommendations,
      generatedAt: new Date(),
    };

    logger.info(`Report generated for verification: ${verificationId}`);

    res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    next(error);
  }
}

export async function getReports(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { limit = 50, offset = 0 } = req.query;

    const verifications = await VerificationResult.findAll({
      where: {
        userId: req.userId,
        status: 'completed',
      },
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [['completedAt', 'DESC']],
    });

    const total = await VerificationResult.count({
      where: {
        userId: req.userId,
        status: 'completed',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        reports: verifications,
        pagination: {
          total,
          limit: Number(limit),
          offset: Number(offset),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function downloadReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { verificationId } = req.params;

    const verification = await VerificationResult.findOne({
      where: { id: verificationId, userId: req.userId },
    });

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    if (!verification.reportUrl) {
      throw new NotFoundError('Report not available for download');
    }

    // In a real implementation, this would generate a signed URL for S3
    res.status(200).json({
      success: true,
      data: {
        downloadUrl: verification.reportUrl,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    next(error);
  }
}
