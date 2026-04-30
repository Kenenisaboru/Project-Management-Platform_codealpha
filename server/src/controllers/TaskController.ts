import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import User from '../models/User';
import { logger, io } from '../index';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendAssignmentEmail = async (
  assigneeId: string,
  taskTitle: string,
  projectId: string,
  assignedByName: string
) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;
  try {
    const assignee = await User.findById(assigneeId).select('email firstName');
    if (!assignee) return;
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@kanutech.pro',
      to: assignee.email,
      subject: `✅ You've been assigned: "${taskTitle}"`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
          <h2 style="color:#6366f1">New Task Assignment</h2>
          <p>Hi ${assignee.firstName},</p>
          <p><strong>${assignedByName}</strong> assigned you to a task:</p>
          <div style="border-left:3px solid #6366f1;padding:12px 16px;background:#f5f5ff;border-radius:4px;margin:16px 0">
            <strong>${taskTitle}</strong>
          </div>
          <p><a href="${process.env.CLIENT_URL}/projects/${projectId}" style="color:#6366f1">View Task →</a></p>
        </div>
      `,
    });
    logger.info(`Assignment email sent to ${assignee.email}`);
  } catch (err) {
    logger.warn('Failed to send assignment email', err);
  }
};

const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  projectId: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  dueDate: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = taskSchema.parse(req.body);
    const user = (req as any).user;

    const project = await Project.findById(data.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      ...data,
      reporterId: user._id,
    });

    await task.save();

    // Emit real-time event
    io.to(data.projectId).emit('taskCreated', task);

    // Send assignment email if an assignee was set
    if (data.assigneeId && data.assigneeId !== user._id.toString()) {
      await sendAssignmentEmail(
        data.assigneeId,
        data.title,
        data.projectId,
        `${user.firstName} ${user.lastName}`
      );
    }

    res.status(201).json(task);
  } catch (err: any) {
    logger.error('Create task error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { projectId, assigneeId, status } = req.query;
    
    const query: any = {};
    if (projectId) query.projectId = projectId;
    if (assigneeId) query.assigneeId = assigneeId;
    if (status) query.status = status;

    if (Object.keys(query).length === 0) {
      return res.status(400).json({ message: 'At least one filter (projectId or assigneeId) is required' });
    }

    const tasks = await Task.find(query)
      .populate('assigneeId', 'firstName lastName avatarUrl')
      .populate('projectId', 'name')
      .sort({ updatedAt: -1 });
      
    res.json(tasks);
  } catch (err) {
    logger.error('Get tasks error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const updater = (req as any).user;
    const prevTask = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit real-time update
    io.to(task.projectId.toString()).emit('taskUpdated', task);

    // Send assignment email if assignee changed
    const newAssigneeId = req.body.assigneeId;
    const prevAssigneeId = prevTask?.assigneeId?.toString();
    if (
      newAssigneeId &&
      newAssigneeId !== prevAssigneeId &&
      newAssigneeId !== updater._id.toString()
    ) {
      await sendAssignmentEmail(
        newAssigneeId,
        task.title,
        task.projectId.toString(),
        `${updater.firstName} ${updater.lastName}`
      );
    }

    res.json(task);
  } catch (err) {
    logger.error('Update task error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const projectId = task.projectId.toString();
    await Task.findByIdAndDelete(req.params.id);

    // Emit real-time deletion
    io.to(projectId).emit('taskDeleted', req.params.id);

    res.json({ message: 'Task deleted' });
  } catch (err) {
    logger.error('Delete task error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
