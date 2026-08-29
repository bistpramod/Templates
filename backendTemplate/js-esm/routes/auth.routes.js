import express from 'express';
import { login, getMe, register } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);

// Remove this line if the project has no public sign-up.
router.post('/register', register);

export default router;
