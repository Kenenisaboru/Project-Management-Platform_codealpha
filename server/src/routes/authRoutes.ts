import { Router } from 'express';
import { register, login, verifyEmail, refreshToken, logout, updateProfile } from '../controllers/authController';
import { protect } from '../utils/jwt';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/verify-email', verifyEmail);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.put('/profile', protect, updateProfile);

export default router;
