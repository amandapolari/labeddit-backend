import { Request, Response } from 'express';
import { GetCommentSchema } from '../dtos/comments/getCommentDto';
import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { CommentBusiness } from '../business/CommentBusiness';
import { CreateCommentSchema } from '../dtos/comments/createCommentDto';
import { UpdateCommentSchema } from '../dtos/comments/updateCommentDto';
import { DeleteCommentSchema } from '../dtos/comments/deleteCommentDto';
import messages from '../messages/messages.json';
import { LikeOrDislikeCommentSchema } from '../dtos/comments/likeOrDislikeCommentDto';

export class CommentController {
    constructor(private commentBusiness: CommentBusiness) {}

    // GET
    public getComments = async (req: Request, res: Response) => {
        try {
            const input = GetCommentSchema.parse({
                token: req.headers.authorization as string,
                q: req.query.q as string | undefined,
            });

            const output = await this.commentBusiness.getComments(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send(messages.unexpected_error);
            }
        }
    };

    // CREATE
    public createComment = async (req: Request, res: Response) => {
        try {
            const input = CreateCommentSchema.parse({
                token: req.headers.authorization as string,
                idPost: req.params.id,
                content: req.body.content as string,
            });

            const output = await this.commentBusiness.createComment(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send(messages.unexpected_error);
            }
        }
    };

    // UPDATE
    public updateComment = async (req: Request, res: Response) => {
        try {
            const input = UpdateCommentSchema.parse({
                token: req.headers.authorization as string,
                idComment: req.params.id as string,
                content: req.body.content as string,
            });

            const output = await this.commentBusiness.updateComment(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send(messages.unexpected_error);
            }
        }
    };

    // DELETE
    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input = DeleteCommentSchema.parse({
                token: req.headers.authorization as string,
                idComment: req.params.id as string,
            });

            await this.commentBusiness.deleteComment(input);

            res.status(200).send({ message: messages.comment_deleted_sucess });
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send(messages.unexpected_error);
            }
        }
    };

    // LIKE E DISLIKE
    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input = LikeOrDislikeCommentSchema.parse({
                idComment: req.params.id,
                token: req.headers.authorization,
                like: req.body.like,
            });

            const output = await this.commentBusiness.likeOrDislikeComment(
                input
            );

            res.status(200).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}
