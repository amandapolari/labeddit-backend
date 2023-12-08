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
import { GetPost, Post } from '../models/Post';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { UserDatabase } from '../database/UserDatabase';
import messages from '../messages/messages.json';
import { CommentDatabase } from '../database/CommentDatabase';

export class PostBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private commentDatabase: CommentDatabase
    ) {}

    // GET
    // public getPosts = async (
    //     input: GetPostsInputDTO
    // ): Promise<GetPostsOutputDTO> => {
    //     const { q, token } = input;
    //     const payload = this.tokenManager.getPayload(token);

    //     if (payload === null) {
    //         throw new BadRequestError(messages.invalid_token);
    //     }

    //     const postsDB = await this.postDatabase.findPosts(
    //         q as string | undefined
    //     );

    //     const posts = postsDB.map((postDB) => {
    //         const post = new Post(
    //             postDB.id,
    //             postDB.creator_id,
    //             postDB.content,
    //             postDB.created_at,
    //             postDB.updated_at,
    //             postDB.likes_count,
    //             postDB.dislikes_count,
    //             postDB.comments_count
    //         );
    //         return post.toBusinessModel();
    //     });

    //     const usersDB = await this.userDatabase.findUsers(
    //         q as string | undefined
    //     );

    //     const mapUserIdName = new Map();

    //     usersDB.forEach((user: any) => {
    //         mapUserIdName.set(user.id, user);
    //     });

    //     const commentsDB = await this.commentDatabase.findComments(
    //         q as string | undefined
    //     );

    //     // const comments = commentsDB.map((commentDB) => {
    //     //     const comment = new Post(
    //     //         commentDB.id,
    //     //         commentDB.creator_id,
    //     //         commentDB.post_id,
    //     //         commentDB.content,
    //     //         commentDB.created_at,
    //     //         commentDB.updated_at,
    //     //         commentDB.likes_count,
    //     //         commentDB.dislikes_count
    //     //     );
    //     //     return comment.toBusinessModel();
    //     // });

    //     const mapPostIdComments = new Map();

    //     console.log(mapPostIdComments);

    //     commentsDB.forEach((comment: any) => {
    //         mapPostIdComments.set(comment.post_id, comment);
    //     });

    //     // -- capturando a QUANTIDADE de comentários de cada post

    //     // postsDB.map((post) => post.id);

    //     // const commentsDB = await this.commentDatabase.findCommentByPostId('');

    //     // const likesDB = await this.commentDatabase.findLikesByPostId(
    //     //     postsDB.map((post) => post.id)
    //     // );

    //     // -- capturando a QUANTIDADE de comentários de cada post
    //     // const commentsDB = await this.commentDatabase.findCommentByPostId(
    //     //     postsDB.map((post) => post.id)
    //     // );

    //     // retornar um array com o id de todos os posts:
    //     // const capturaIdDosPosts = postsDB.map((post) => post.id);
    //     // console.log(capturaIdDosPosts);

    //     const output = posts.map((post) => {
    //         const user = mapUserIdName.get(post.creatorId);
    //         const comment = mapPostIdComments.get(post.id); // captura o comentário do post
    //         // número de quantos posts tem:
    //         const countComments = comment?.length;

    //         return {
    //             id: post.id,
    //             creator: {
    //                 id: user.id,
    //                 nickname: user.nickname,
    //             },
    //             createdAt: post.createdAt,
    //             updatedAt: post.updatedAt,
    //             content: post.content,
    //             likesCount: post.likesCount,
    //             dislikesCount: post.dislikesCount,
    //             // commentsCount: Number(countComments),
    //             commentsCount: countComments
    //         };
    //     });

    //     return output;
    // };

    // public getPosts = async (
    //     input: GetPostsInputDTO
    // ): Promise<GetPostsOutputDTO> => {
    //     const { q, token } = input;
    //     const payload = this.tokenManager.getPayload(token);

    //     if (payload === null) {
    //         throw new BadRequestError(messages.invalid_token);
    //     }

    //     const postsDB = await this.postDatabase.findPosts(
    //         q as string | undefined
    //     );

    //     const posts = postsDB.map((postDB) => {
    //         const post = new Post(
    //             postDB.id,
    //             postDB.creator_id,
    //             postDB.content,
    //             postDB.created_at,
    //             postDB.updated_at,
    //             postDB.likes_count,
    //             postDB.dislikes_count,
    //             postDB.comments_count
    //         );
    //         return post.toBusinessModel();
    //     });

    //     const usersDB = await this.userDatabase.findUsers(
    //         q as string | undefined
    //     );

    //     const mapUserIdName = new Map();

    //     usersDB.forEach((user: any) => {
    //         mapUserIdName.set(user.id, user);
    //     });

    //     const commentsDB = await this.commentDatabase.findComments(
    //         q as string | undefined
    //     );

    //     const mapPostIdComments = new Map();

    //     commentsDB.forEach((comment: any) => {
    //         if (!mapPostIdComments.has(comment.post_id)) {
    //             mapPostIdComments.set(comment.post_id, []);
    //         }
    //         mapPostIdComments.get(comment.post_id).push(comment);
    //     });

    //     const output = posts.map((post) => {
    //         const user = mapUserIdName.get(post.creatorId);
    //         const comments = mapPostIdComments.get(post.id) || [];

    //         return {
    //             id: post.id,
    //             creator: {
    //                 id: user.id,
    //                 nickname: user.nickname,
    //             },
    //             createdAt: post.createdAt,
    //             updatedAt: post.updatedAt,
    //             content: post.content,
    //             likesCount: post.likesCount,
    //             dislikesCount: post.dislikesCount,
    //             commentsCount: comments.length,
    //             comments: comments.map((comment: any) => ({
    //                 id: comment.id,
    //                 creator: {
    //                     id: comment.creator_id,
    //                     nickname: user.nickname,
    //                 },
    //                 createdAt: comment.created_at,
    //                 updatedAt: comment.updated_at,
    //                 content: comment.content,
    //                 likesCount: comment.likes_count,
    //                 dislikesCount: comment.dislikes_count,
    //             })),
    //         };
    //     });

    //     return output;
    // };

    public getPosts = async (
        input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
        const { q, token } = input;
        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
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

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const mapUserIdName = new Map();

        usersDB.forEach((user: any) => {
            mapUserIdName.set(user.id, user);
        });

        const commentsDB = await this.commentDatabase.findComments(
            q as string | undefined
        );

        const mapPostIdComments = new Map();

        commentsDB.forEach((comment: any) => {
            if (!mapPostIdComments.has(comment.post_id)) {
                mapPostIdComments.set(comment.post_id, []);
            }
            mapPostIdComments.get(comment.post_id).push(comment);
        });

        const output = posts.map((post) => {
            const user = mapUserIdName.get(post.creatorId);
            const comments = mapPostIdComments.get(post.id) || [];

            return {
                id: post.id,
                creator: {
                    id: user.id,
                    nickname: user.nickname,
                },
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                content: post.content,
                likesCount: post.likesCount,
                dislikesCount: post.dislikesCount,
                commentsCount: comments.length,
                comments: comments.map((comment: any) => {
                    const commentUser = mapUserIdName.get(comment.creator_id);
                    return {
                        id: comment.id,
                        creator: {
                            id: commentUser.id,
                            nickname: commentUser.nickname,
                        },
                        createdAt: comment.created_at,
                        updatedAt: comment.updated_at,
                        content: comment.content,
                        likesCount: comment.likes_count,
                        dislikesCount: comment.dislikes_count,
                    };
                }),
            };
        });

        return output;
    };

    // CREATE
    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { token, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
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
            message: messages.post_created_sucess,
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
            throw new BadRequestError(messages.invalid_token);
        }

        const post = await this.postDatabase.findPostById(idToEdit);

        if (!post) {
            throw new BadRequestError(messages.id_post_not_found);
        }

        if (post.creator_id !== payload.id) {
            throw new BadRequestError(messages.not_authorized);
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
            message: messages.post_updated_sucess,
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
            throw new BadRequestError(messages.invalid_token);
        }

        const post = await this.postDatabase.findPostById(idToDelete);

        if (!post) {
            throw new BadRequestError(messages.id_post_not_found);
        }

        if (post.creator_id !== payload.id) {
            throw new BadRequestError(messages.not_authorized);
        }

        await this.postDatabase.deletePost(idToDelete);

        const output = {
            message: messages.post_deleted_sucess,
        };

        return output;
    };
}
