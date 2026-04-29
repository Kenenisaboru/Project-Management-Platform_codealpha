import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/TaskController';
import { protect } from '../utils/jwt';

const router = Router();

router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
