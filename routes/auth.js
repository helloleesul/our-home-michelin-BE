import { Router }  from 'express';
import passport from 'passport';
import { login, join } from '../controllers/auth.js'

const router = Router();

router.post(
    '/api/login',
    passport.authenticate('local', { session: false }),
    login
);

router.post('/api/join', join);

export default router;