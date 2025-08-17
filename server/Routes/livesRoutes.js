import express from 'express';
import { addLive, deleteLive, getLives } from '../controllers/livesController.js';
import protect from '../Middleware/auth.js';

const router = express.Router();

router.get('/', getLives);
router.post('/', protect, addLive);
router.delete('/:id', protect, deleteLive);

export default router;