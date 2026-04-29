import { Router } from 'express';
import { createWorkspace, getWorkspaces, addMember, getWorkspaceMembers, updateWorkspace, getWorkspaceStats } from '../controllers/workspaceController';
import { protect } from '../utils/jwt';

const router = Router();

router.use(protect);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);
router.post('/:id/members', addMember);
router.get('/:id/members', getWorkspaceMembers);
router.put('/:id', updateWorkspace);
router.get('/:id/stats', getWorkspaceStats);

export default router;
