import { Request, Response, NextFunction } from 'express';
import { VerificationResult, Candidate } from '../../models';
import { ValidationError, NotFoundError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export async function startVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { candidateId, verificationType, priority } = req.body;

    if (!candidateId || !verificationType) {
      throw new ValidationError('Candidate ID and verification type are required');
    }

    // Verify candidate belongs to user
    const candidate = await Candidate.findOne({
      where: { id: candidateId, userId: req.userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    // Create verification result
    const verification = await VerificationResult.create({
      candidateId,
      userId: req.userId,
      verificationType,
      status: 'pending',
      priority: priority || 'normal',
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

    // Update candidate status
    await candidate.update({ status: 'in_progress' });

    logger.info(`Verification started: ${verification.id} for candidate ${candidateId}`);

    res.status(201).json({
      success: true,
      data: { verification },
    });
  } catch (error) {
    next(error);
  }
}

export async function getVerifications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { status, candidateId, limit = 50, offset = 0 } = req.query;

    const where: any = { userId: req.userId };
    if (status) where.status = status;
    if (candidateId) where.candidateId = candidateId;

    const verifications = await VerificationResult.findAll({
      where,
      include: [
        {
          model: Candidate,
          as: 'candidate',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    const total = await VerificationResult.count({ where });

    res.status(200).json({
      success: true,
      data: {
        verifications,
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

export async function getVerificationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;

    const verification = await VerificationResult.findOne({
      where: { id, userId: req.userId },
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

    res.status(200).json({
      success: true,
      data: { verification },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;
    const updates = req.body;

    const verification = await VerificationResult.findOne({
      where: { id, userId: req.userId },
    });

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    await verification.update(updates);

    logger.info(`Verification updated: ${id}`);

    res.status(200).json({
      success: true,
      data: { verification },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;

    const verification = await VerificationResult.findOne({
      where: { id, userId: req.userId },
    });

    if (!verification) {
      throw new NotFoundError('Verification not found');
    }

    await verification.destroy();

    logger.info(`Verification deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Verification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
