import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../errors/BaseError';
import { GetPostsSchema } from '../dtos/posts/getPostsDto';
import { CreatePostSchema } from '../dtos/posts/createPostDto';
import { UpdatePostSchema } from '../dtos/posts/updatePostDto';
import { DeleteUserSchema } from '../dtos/users/deleteUserDto';
import { PostBusiness } from '../business/PostBusiness';
import { LikeOrDislikePostSchema } from '../dtos/posts/likeOrDislikePostDto';

export class PostController {
    constructor(private postBusiness: PostBusiness) {}

    // GET
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = GetPostsSchema.parse({
                q: req.query.q as string | undefined,
                token: req.headers.authorization as string,
            });

            const output = await this.postBusiness.getPosts(input);

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

    // CREATE
    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                token: req.headers.authorization as string,
                content: req.body.content as string,
            });

            const output = await this.postBusiness.createPost(input);

            res.status(201).send(output);
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

    // UPDATE
    public updatePost = async (req: Request, res: Response) => {
        try {
            const input = UpdatePostSchema.parse({
                idToEdit: req.params.id,
                token: req.headers.authorization,
                content: req.body.content,
            });

            const output = await this.postBusiness.updatePost(input);

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

    // DELETE
    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = DeleteUserSchema.parse({
                idToDelete: req.params.id,
                token: req.headers.authorization as string,
            });

            const output = await this.postBusiness.deletePost(input);

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

    // LIKE E DISLIKE
    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input = LikeOrDislikePostSchema.parse({
                idPost: req.params.id,
                token: req.headers.authorization,
                like: req.body.like,
            });

            const output = await this.postBusiness.likeOrDislikePost(input);

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
