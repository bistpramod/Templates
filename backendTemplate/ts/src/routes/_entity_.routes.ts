import express from 'express';
import { getAll, getOne, create, update, remove } from '../controllers/_entity_.controller';
import { verifyToken, requireRole } from '../middleware/auth.middleware';
import { Role } from '../types/enum.types';

const router = express.Router();

// Public reads
router.get('/', getAll);
router.get('/:idOrSlug', getOne);

// Protected writes
router.post('/', verifyToken, requireRole(Role.ADMIN), create);
router.put('/:id', verifyToken, requireRole(Role.ADMIN), update);
router.delete('/:id', verifyToken, requireRole(Role.ADMIN), remove);

export default router;
