import express from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/user.js';

const router = express.Router();

router.get('/api/user', getUser);

router.post('/api/user/', updateUser);

router.delete('/api/user/:id/', deleteUser);

export default router;