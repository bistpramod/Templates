import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/_entity_.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public reads
router.get('/', getAll);
router.get('/:idOrSlug', getOne);

// PLACEHOLDER: swap '_ROLE_ADMIN_' for your real admin role string.
// Protected writes
router.post('/', verifyToken, requireRole('_ROLE_ADMIN_'), create);
router.put('/:id', verifyToken, requireRole('_ROLE_ADMIN_'), update);
router.delete('/:id', verifyToken, requireRole('_ROLE_ADMIN_'), remove);

export default router;
