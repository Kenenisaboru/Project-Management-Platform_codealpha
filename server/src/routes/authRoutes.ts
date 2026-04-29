import { Router } from 'express';
import { register, login, refreshToken, logout, updateProfile } from '../controllers/authController';
import { protect } from '../utils/jwt';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.put('/profile', protect, updateProfile);

export default router;
