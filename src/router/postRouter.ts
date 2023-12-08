import express from 'express';
import { PostController } from '../controller/PostController';
import { PostBusiness } from '../business/PostBusiness';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { PostDatabase } from '../database/PostDatabase';
import { UserDatabase } from '../database/UserDatabase';
import { CommentDatabase } from '../database/CommentDatabase';

export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new IdGenerator(),
        new TokenManager(),
        new PostDatabase(),
        new UserDatabase(),
        new CommentDatabase()
    )
);

postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);
