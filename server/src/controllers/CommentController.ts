import { Request, Response } from 'express';
import Comment from '../models/Comment';
import Task from '../models/Task';
import User from '../models/User';
import { logger, io } from '../index';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const commentSchema = z.object({
  text: z.string().min(1).max(2000),
});

// Re-use the same transporter config as authController
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** GET /api/v1/tasks/:taskId/comments */
export const getComments = async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('authorId', 'firstName lastName avatarUrl')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    logger.error('Get comments error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** POST /api/v1/tasks/:taskId/comments */
export const addComment = async (req: Request, res: Response) => {
  try {
    const data = commentSchema.parse(req.body);
    const author = (req as any).user;

    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const comment = new Comment({
      taskId: req.params.taskId,
      authorId: author._id,
      text: data.text,
    });
    await comment.save();

    // Populate author for the real-time payload
    const populated = await comment.populate('authorId', 'firstName lastName avatarUrl');

    // Emit to everyone in the project room
    io.to(task.projectId.toString()).emit('newComment', populated);

    // Notify task assignee via email if configured & different from commenter
    if (
      task.assigneeId &&
      task.assigneeId.toString() !== author._id.toString() &&
      process.env.SMTP_HOST &&
      process.env.SMTP_USER
    ) {
      try {
        const assignee = await User.findById(task.assigneeId).select('email firstName');
        if (assignee) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'no-reply@kanutech.pro',
            to: assignee.email,
            subject: `💬 New comment on "${task.title}"`,
            html: `
              <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
                <h2 style="color:#6366f1">New Comment on Your Task</h2>
                <p>Hi ${assignee.firstName},</p>
                <p><strong>${author.firstName} ${author.lastName}</strong> commented on <strong>"${task.title}"</strong>:</p>
                <blockquote style="border-left:3px solid #6366f1;padding:12px 16px;background:#f5f5ff;border-radius:4px;margin:16px 0">
                  ${data.text}
                </blockquote>
                <p><a href="${process.env.CLIENT_URL}/projects/${task.projectId}" style="color:#6366f1">View Task →</a></p>
              </div>
            `,
          });
          logger.info(`Comment notification sent to ${assignee.email}`);
        }
      } catch (mailErr) {
        logger.warn('Failed to send comment notification email', mailErr);
      }
    }

    res.status(201).json(populated);
  } catch (err: any) {
    logger.error('Add comment error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

/** DELETE /api/v1/tasks/:taskId/comments/:commentId */
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const author = (req as any).user;
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.authorId.toString() !== author._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own comments' });
    }

    const task = await Task.findById(comment.taskId);
    await Comment.findByIdAndDelete(req.params.commentId);

    if (task) {
      io.to(task.projectId.toString()).emit('commentDeleted', {
        commentId: req.params.commentId,
        taskId: req.params.taskId,
      });
    }

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    logger.error('Delete comment error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
