import { Request, Response } from 'express';
import Project from '../models/Project';
import Workspace from '../models/Workspace';
import { logger } from '../index';
import { z } from 'zod';

const projectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  workspaceId: z.string(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = projectSchema.parse(req.body);
    const user = (req as any).user;

    // Check if workspace exists and user is a member
    const workspace = await Workspace.findById(data.workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const isMember = workspace.members.some((m: any) => m.userId.toString() === user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized to create projects in this workspace' });
    }

    const project = new Project({
      ...data,
      ownerId: user._id,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err: any) {
    logger.error('Create project error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const { workspaceId } = req.query;
    const user = (req as any).user;

    if (!workspaceId) {
      return res.status(400).json({ message: 'workspaceId is required' });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    const isMember = workspace.members.some((m: any) => m.userId.toString() === user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const projects = await Project.find({ workspaceId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    logger.error('Get projects error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = (req as any).user;
    const workspace = await Workspace.findById(project.workspaceId);
    if (!workspace || !workspace.members.some((m: any) => m.userId.toString() === user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (err) {
    logger.error('Get project error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = (req as any).user;
    if (project.ownerId.toString() !== user._id.toString()) {
      // Check if user is workspace admin
      const workspace = await Workspace.findById(project.workspaceId);
      const member = workspace?.members.find((m: any) => m.userId.toString() === user._id.toString());
      if (!member || (member.role !== 'ORG_ADMIN' && member.role !== 'SUPER_ADMIN')) {
        return res.status(403).json({ message: 'Not authorized to update this project' });
      }
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    logger.error('Update project error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const user = (req as any).user;
    if (project.ownerId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Only project owner can delete projects' });
    }

    await Project.findByIdAndDelete(req.params.id);
    // TODO: Delete tasks associated with project
    res.json({ message: 'Project deleted' });
  } catch (err) {
    logger.error('Delete project error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
