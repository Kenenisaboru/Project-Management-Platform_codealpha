import { Request, Response, NextFunction } from 'express';
import { logger } from '../index';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  logger.error(err.stack || err.message);
  res.json({
    message: err.message,
    // In prod hide stack trace
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
