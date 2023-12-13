import express from 'express';
import { CommentController } from '../controller/CommentController';
import { CommentBusiness } from '../business/CommentBusiness';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { CommentDatabase } from '../database/CommentDatabase';
import { UserDatabase } from '../database/UserDatabase';

export const commentRouter = express.Router();

const commentController = new CommentController(
    new CommentBusiness(
        new IdGenerator(),
        new TokenManager(),
        new CommentDatabase(),
        new UserDatabase()
    )
);

commentRouter.get('/', commentController.getComments);
commentRouter.post('/:id', commentController.createComment);
commentRouter.put('/:id', commentController.updateComment);
commentRouter.delete('/:id', commentController.deleteComment);
commentRouter.put('/:id/like', commentController.likeOrDislikeComment);
