import { format } from 'date-fns';
import { PostDatabase } from '../database/PostDatabase';
import {
    CreatePostInputDTO,
    CreatePostOutputDTO,
} from '../dtos/posts/createPostDto';
import {
    DeletePostInputDTO,
    DeletePostOutputDTO,
} from '../dtos/posts/deletePostDto';
import { GetPostsInputDTO, GetPostsOutputDTO } from '../dtos/posts/getPostsDto';
import {
    UpdatePostInputDTO,
    UpdatePostOutputDTO,
} from '../dtos/posts/updatePostDto';
import { BadRequestError } from '../errors/BadRequestError';
import { Post } from '../models/Post';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';

export class PostBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase
    ) {}

    // GET
    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const postsDB = await this.postDatabase.findPosts(
            q as string | undefined
        );

        const posts = postsDB.map((postDB) => {
            const post = new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.created_at,
                postDB.updated_at,
                postDB.likes_count,
                postDB.dislikes_count,
                postDB.comments_count
            );
            return post.toBusinessModel();
        });

        const output = posts;

        return output;
    };

    // CREATE
    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { token, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const id = this.idGenerator.generate();

        const post = new Post(
            id,
            payload.id,
            content,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            0,
            0,
            0
        );

        const newPost = post.toDatabaseModel();

        await this.postDatabase.createPost(newPost);

        const output = {
            message: 'Post criado com sucesso',
            content,
        };

        return output;
    };

    // UPDATE
    public updatePost = async (
        input: UpdatePostInputDTO
    ): Promise<UpdatePostOutputDTO> => {
        const { idToEdit, token, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const post = await this.postDatabase.findPostById(idToEdit);

        if (post.creator_id !== payload.id) {
            throw new BadRequestError(
                'Você não pode editar um post que não é seu'
            );
        }

        const updatedPost = new Post(
            post.id,
            post.creator_id,
            content,
            post.created_at,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            post.likes_count,
            post.dislikes_count,
            post.comments_count
        );

        const newPost = updatedPost.toDatabaseModel();

        await this.postDatabase.updatePost(
            idToEdit,
            newPost.content,
            newPost.updated_at
        );

        const output = {
            message: 'Post atualizado com sucesso',
            content,
        };

        return output;
    };

    // DELETE
    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { idToDelete, token } = input;
        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const post = await this.postDatabase.findPostById(idToDelete);

        if (post.creator_id !== payload.id) {
            throw new BadRequestError(
                'Você não pode deletar um post que não é seu'
            );
        }

        await this.postDatabase.deletePost(idToDelete);

        const output = {
            message: 'Post deletado com sucesso',
        };

        return output;
    };
}
