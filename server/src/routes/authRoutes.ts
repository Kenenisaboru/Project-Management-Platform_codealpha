import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/authController';
import { protect } from '../utils/jwt';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);

export default router;
