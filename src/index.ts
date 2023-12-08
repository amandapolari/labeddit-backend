import express from 'express';
import cors from 'cors';
import { userRouter } from './router/userRouter';
import dotenv from 'dotenv';
import { postRouter } from './router/postRouter';
import { commentRouter } from './router/commentRouter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT) || 3003;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
