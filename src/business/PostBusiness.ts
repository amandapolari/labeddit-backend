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
import {
    LikeOrDislikePostInputDTO,
    LikeOrDislikePostOutputDTO,
} from '../dtos/posts/likeOrDislikePostDto';
import { NotFoundError } from '../errors/NotFoundError';

export class PostBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private commentDatabase: CommentDatabase
    ) {}

    // GET
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

        const post = await this.postDatabase.findPostById(idToEdit);

        if (!post) {
            throw new BadRequestError(messages.id_post_not_found);
        }

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
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

    // LIKE E DISLIKE
    public likeOrDislikePost = async (
        input: LikeOrDislikePostInputDTO
    ): Promise<LikeOrDislikePostOutputDTO> => {
        // Recebendo e desestruturando os dados do input:
        const { idPost, token, like } = input;

        // Obtendo o payload através do token:
        const payload = this.tokenManager.getPayload(token);

        // Se o token for inválido vai retornar null
        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        // Esse é o id de quem está logado, pois foi obtido através do token:
        const userId = payload.id;

        // Buscando o post no banco de dados:
        const postDB = await this.postDatabase.findPostById(idPost);

        // Se ele não encontrar o post, vai retornar undefined e vai lançar um erro:
        if (!postDB) {
            throw new NotFoundError(messages.id_post_not_found);
        }

        // Instanciando que o usuário foneceu o id:
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

        // Se o id do usuário for igual ao id do criador do post, vai lançar um erro:
        if (postDB.creator_id === payload.id) {
            throw new BadRequestError(messages.like_not_allowed);
        }

        // Buscando no banco de dados se o usuário já deu like ou dislike no post:
        const likeDislikeDB = await this.postDatabase.findLikeOrDislike(
            userId,
            post.getId()
        );

        // Se o usuário tiver dado like ou dislike, vai retornar 1 ou 0:
        // Porque na tabela sql like e dislike são booleanos:
        const likeSqlite = like ? 1 : 0;

        // Se o usuário não tiver dado like ou dislike, vai criar um novo like ou dislike:
        if (!likeDislikeDB) {
            // Inserindo um like ou um dislike no banco de dados na tabela likes_dislikes:
            await this.postDatabase.createLikeDislike(
                userId,
                post.getId(),
                likeSqlite
            );

            // Se o usuário tiver dado like, vai adicionar um like no post:
            // se like === true, vai adicionar um like:
            if (like) {
                post.addLike();
                await this.postDatabase.updateLikes(
                    idPost,
                    post.getLikesCount()
                );

                // Se o usuário tiver dado dislike, vai adicionar um dislike no post:
            } else {
                post.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikesCount()
                );
            }

            // Se o usuário já tiver dado like ou dislike, vai atualizar o like ou dislike:
        } else if (likeDislikeDB.like) {
            if (like) {
                // Se o usuário já tiver dado like e clicar em like novamente, vai remover o like:
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeLike();

                // Atualizando o número de likes no banco de dados:
                await this.postDatabase.updateLikes(
                    idPost,
                    post.getLikesCount()
                );
            } else {
                // Se o usuário já tiver dado like e clicar em dislike, vai atualizar o like para dislike:
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeLike();
                post.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.postDatabase.updateLikes(
                    idPost,
                    post.getLikesCount()
                );
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikesCount()
                );
            }
        } else {
            if (!like) {
                // Se o usuário já tiver dado dislike e clicar em dislike novamente, vai remover o dislike:
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeDislike();

                // Atualizando o número de dislikes no banco de dados:
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikesCount()
                );
            } else {
                // Se o usuário já tiver dado dislike e clicar em like, vai atualizar o dislike para like:
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeDislike();
                post.addLike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.postDatabase.updateLikes(
                    idPost,
                    post.getLikesCount()
                );
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikesCount()
                );
            }
        }

        let output;

        if (likeSqlite === 1) {
            output = {
                message: messages.like_created_sucess,
            };
        } else {
            output = {
                message: messages.dislike_created_sucess,
            };
        }

        return output;
    };
}
