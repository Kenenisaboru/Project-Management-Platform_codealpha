import { Router } from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController';
import { protect } from '../utils/jwt';

const router = Router();

router.use(protect);

router.post('/', createWorkspace);
router.get('/', getWorkspaces);

export default router;
