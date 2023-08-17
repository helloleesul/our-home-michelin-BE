import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import dotenv from 'dotenv';

import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const mongoDB_URI = 'mongodb+srv://argandd34:elice123123%21@cluster0.ivnuzfd.mongodb.net/'

const startServer = async() => {
    try {
        await mongoose.connect(mongoDB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB 접속 성공');

        app.listen(3000, () => {
            console.log('3000포트에서 서버가 작동중');
        });
    } catch (error) {
        console.error('DB 접속 실패')
    }
};

startServer();

app.use(authRoutes);
app.use(userRoutes);