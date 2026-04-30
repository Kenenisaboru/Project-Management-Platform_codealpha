import { Router } from 'express';
import { getComments, addComment, deleteComment } from '../controllers/CommentController';
import { protect } from '../utils/jwt';

const router = Router({ mergeParams: true }); // mergeParams to access :taskId

router.use(protect);

router.get('/', getComments);
router.post('/', addComment);
router.delete('/:commentId', deleteComment);

export default router;
