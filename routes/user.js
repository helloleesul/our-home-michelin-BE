import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/user.js';

const router = express.Router();

router.get('/api/myinfo', getUser);

router.post('/api/myinfo/', updateUser);

router.delete('/api/myinfo/:id/', deleteUser);

export default router;