import { Request, Response } from 'express';
import Workspace from '../models/Workspace';
import Organization from '../models/Organization';
import mongoose from 'mongoose';
import { logger } from '../index';
import { z } from 'zod';

const workspaceSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  orgId: z.string().optional(), // if not provided, use user's default org
});

export const createWorkspace = async (req: Request, res: Response) => {
  try {
    const data = workspaceSchema.parse(req.body);
    const user = (req as any).user;

    let orgId = data.orgId;
    if (!orgId) {
      // Find or create default organization for user
      let org = await Organization.findOne({ ownerId: user._id });
      if (!org) {
        org = new Organization({
          name: `${user.firstName}'s Org`,
          slug: `${user.firstName.toLowerCase()}-${Date.now()}`,
          ownerId: user._id,
        });
        await org.save();
      }
      orgId = org._id.toString();
    }

    const workspace = new Workspace({
      ...data,
      orgId,
      members: [{ userId: user._id, role: 'ORG_ADMIN' }],
    });

    await workspace.save();
    res.status(201).json(workspace);
  } catch (err: any) {
    logger.error('Create workspace error', err);
    if (err instanceof z.ZodError) {
      return res.status(400).json({ errors: err.errors });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWorkspaces = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const workspaces = await Workspace.find({ 'members.userId': user._id });
    res.json(workspaces);
  } catch (err) {
    logger.error('Get workspaces error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    const workspaceId = req.params.id;
    const currentUser = (req as any).user;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Check if current user is an admin in the workspace
    const member = workspace.members.find(m => m.userId.toString() === currentUser._id.toString());
    if (!member || (member.role !== 'ORG_ADMIN' && member.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Only admins can add members' });
    }

    // Find the user to add
    const userToAdd = await (mongoose.model('User') as any).findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    // Check if already a member
    if (workspace.members.some(m => m.userId.toString() === userToAdd._id.toString())) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    workspace.members.push({ userId: userToAdd._id, role: role || 'MEMBER' });
    await workspace.save();

    res.json({ message: 'Member added successfully' });
  } catch (err) {
    logger.error('Add member error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWorkspaceMembers = async (req: Request, res: Response) => {
  try {
    const workspace = await Workspace.findById(req.params.id).populate('members.userId', 'firstName lastName email avatarUrl');
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });
    res.json(workspace.members);
  } catch (err) {
    logger.error('Get members error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const currentUser = (req as any).user;

    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    // Check if current user is an admin
    const member = workspace.members.find(m => m.userId.toString() === currentUser._id.toString());
    if (!member || (member.role !== 'ORG_ADMIN' && member.role !== 'SUPER_ADMIN')) {
      return res.status(403).json({ message: 'Only admins can update workspace settings' });
    }

    workspace.name = name || workspace.name;
    workspace.description = description || workspace.description;
    await workspace.save();

    res.json(workspace);
  } catch (err) {
    logger.error('Update workspace error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getWorkspaceStats = async (req: Request, res: Response) => {
  try {
    const workspaceId = req.params.id;
    const user = (req as any).user;

    const projects = await (mongoose.model('Project') as any).find({ workspaceId });
    const projectIds = projects.map((p: any) => p._id);

    const tasks = await (mongoose.model('Task') as any).find({ projectId: { $in: projectIds } });

    const stats = {
      activeProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: tasks.filter((t: any) => t.status === 'DONE').length,
      pendingTasks: tasks.filter((t: any) => t.status !== 'DONE').length,
      efficiency: tasks.length > 0 ? Math.round((tasks.filter((t: any) => t.status === 'DONE').length / tasks.length) * 100) : 0
    };

    res.json(stats);
  } catch (err) {
    logger.error('Get stats error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
