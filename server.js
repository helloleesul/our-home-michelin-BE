import express from 'express';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

const mongoDB_URI = 'mongodb+srv://argandd34:elice123123-@cluster0.ivnuzfd.mongodb.net/'

const startServer = async() => {
    try {
        await mongoose.connect(mongoDB_URI, {
            useNewUrlParse: true,
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

