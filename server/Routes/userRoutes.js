import express from 'express';
import { login, addAdmin } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', login);
router.post('/add', addAdmin);

export default router;