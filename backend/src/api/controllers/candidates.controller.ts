import { Request, Response, NextFunction } from 'express';
import { Candidate } from '../../models';
import { ValidationError, NotFoundError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export async function createCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { firstName, lastName, email, phone, linkedinUrl, resumeUrl, metadata } = req.body;

    if (!firstName || !lastName || !email) {
      throw new ValidationError('First name, last name, and email are required');
    }

    const candidate = await Candidate.create({
      userId: req.userId,
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      resumeUrl,
      status: 'pending',
      metadata: metadata || {},
    });

    logger.info(`Candidate created: ${candidate.id} by user ${req.userId}`);

    res.status(201).json({
      success: true,
      data: { candidate },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCandidates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { status, limit = 50, offset = 0 } = req.query;

    const where: any = { userId: req.userId };
    if (status) {
      where.status = status;
    }

    const candidates = await Candidate.findAll({
      where,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'DESC']],
    });

    const total = await Candidate.count({ where });

    res.status(200).json({
      success: true,
      data: {
        candidates,
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

export async function getCandidateById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;

    const candidate = await Candidate.findOne({
      where: { id, userId: req.userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    res.status(200).json({
      success: true,
      data: { candidate },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;
    const { firstName, lastName, email, phone, linkedinUrl, resumeUrl, status, metadata } = req.body;

    const candidate = await Candidate.findOne({
      where: { id, userId: req.userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    const updates: any = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (linkedinUrl !== undefined) updates.linkedinUrl = linkedinUrl;
    if (resumeUrl !== undefined) updates.resumeUrl = resumeUrl;
    if (status) updates.status = status;
    if (metadata) updates.metadata = metadata;

    await candidate.update(updates);

    logger.info(`Candidate updated: ${id} by user ${req.userId}`);

    res.status(200).json({
      success: true,
      data: { candidate },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCandidate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.userId) {
      throw new ValidationError('User ID is required');
    }

    const { id } = req.params;

    const candidate = await Candidate.findOne({
      where: { id, userId: req.userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    await candidate.destroy();

    logger.info(`Candidate deleted: ${id} by user ${req.userId}`);

    res.status(200).json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
