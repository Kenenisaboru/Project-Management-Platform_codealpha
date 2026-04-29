import { Request, Response } from 'express';
import Workspace from '../models/Workspace';
import Organization from '../models/Organization';
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
