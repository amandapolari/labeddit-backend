import express from 'express';
// import express, { Request, Response } from 'express';
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

// test ping
// app.get('/ping', async (req: Request, res: Response) => {
//     try {
//         res.status(200).send({ message: 'Pong!' });
//     } catch (error) {
//         console.log(error);

//         if (req.statusCode === 200) {
//             res.status(500);
//         }

//         if (error instanceof Error) {
//             res.send(error.message);
//         } else {
//             res.send('Erro inesperado');
//         }
//     }
// });

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);
