import express from 'express';
import cors from 'cors';
import { userRouter } from './router/userRouter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.PORT) || 3003;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.use('/users', userRouter);
