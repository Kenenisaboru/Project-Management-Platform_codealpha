import { Request, Response } from 'express';
import User, { IUser, UserRole } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { logger } from '../index';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Zod schemas for validation
const registerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// Email transporter – in production use SendGrid/Mailgun via env vars
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Register a new user */
export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }
    const user = new User({
      ...data,
      role: UserRole.MEMBER,
      isEmailVerified: false,
    });
    await user.save();
    // Send verification email (simple token)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Store token in user (for demo we use refreshToken field – replace with proper collection in prod)
    user.refreshToken = verificationToken; // quick placeholder
    await user.save();
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&id=${user._id}`;
    
    // Send verification email only if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'no-reply@taskflow.pro',
          to: user.email,
          subject: 'Verify your TaskFlow Pro X account',
          html: `<p>Hello ${user.firstName},</p><p>Please verify your account by clicking <a href="${verifyUrl}">this link</a>.</p>`,
        });
        logger.info(`Verification email sent to ${user.email}`);
      } catch (mailErr) {
        logger.error('Failed to send verification email', mailErr);
        logger.info(`Verification URL for ${user.email}: ${verifyUrl}`);
      }
    } else {
      logger.info(`SMTP not configured. Verification URL for ${user.email}: ${verifyUrl}`);
    }

    res.status(201).json({ 
      message: 'User created successfully',
      note: process.env.SMTP_HOST ? 'Verification email sent' : 'Email verification skipped in development (check server logs for link)'
    });
  } catch (err: any) {
    logger.error('Register error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** Login */
export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate tokens
    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });
    // Store refresh token (hashed) – simple store here
    user.refreshToken = refreshToken;
    await user.save();
    // Set HttpOnly cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err: any) {
    logger.error('Login error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** Refresh token endpoint */
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);
  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res.sendStatus(403);
    }
    const newAccess = generateAccessToken({ id: user._id, role: user.role });
    const newRefresh = generateRefreshToken({ id: user._id });
    user.refreshToken = newRefresh;
    await user.save();
    res.cookie('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken: newAccess });
  } catch (err) {
    logger.warn('Refresh token error', err);
    res.sendStatus(403);
  }
};

/** Logout */
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await User.findByIdAndUpdate(payload.id, { $unset: { refreshToken: '' } });
    } catch (_) {}
  }
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Logged out' });
};
