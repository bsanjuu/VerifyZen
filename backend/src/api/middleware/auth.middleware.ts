import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../models';
import env from '../../config/env';
import { AuthenticationError, AuthorizationError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export interface AuthRequest extends Request {
  user?: User;
  userId?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
}

export function authorize(...allowedRoles: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Not authenticated');
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
