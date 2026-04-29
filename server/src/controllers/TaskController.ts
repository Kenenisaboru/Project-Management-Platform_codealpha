import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import { logger, io } from '../index';
import { z } from 'zod';

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
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Emit real-time update
    io.to(task.projectId.toString()).emit('taskUpdated', task);

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
