import { format } from 'date-fns';
import { CommentDatabase } from '../database/CommentDatabase';
import { UserDatabase } from '../database/UserDatabase';
import {
    GetCommentInputDTO,
    GetCommentOutputDTO,
} from '../dtos/comments/getCommentDto';
import { BadRequestError } from '../errors/BadRequestError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import messages from '../messages/messages.json';
import { Comment } from '../models/Comment';
import {
    CreateCommentInputDTO,
    CreateCommentOutputDTO,
} from '../dtos/comments/createCommentDto';
import {
    UpdateCommentInputDTO,
    UpdateCommentOutputDTO,
} from '../dtos/comments/updateCommentDto';
import {
    DeleteCommentInputDTO,
    DeleteCommentOutputDTO,
} from '../dtos/comments/deleteCommentDto';
import {
    LikeOrDislikeCommentInputDTO,
    LikeOrDislikeCommentOutputDTO,
} from '../dtos/comments/likeOrDislikeCommentDto';
import { NotFoundError } from '../errors/NotFoundError';
import { Post } from '../models/Post';
import { PostDatabase } from '../database/PostDatabase';

export class CommentBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private commentDatabase: CommentDatabase,
        private userDatabase: UserDatabase,
        private postDatabase: PostDatabase
    ) {}

    // GET
    public getComments = async (
        input: GetCommentInputDTO
    ): Promise<GetCommentOutputDTO> => {
        const { token, q } = input;
        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const commentsDB = await this.commentDatabase.findComments(
            q as string | undefined
        );

        const comments: any = commentsDB.map((commentDB) => {
            const comment = new Comment(
                commentDB.id,
                commentDB.creator_id,
                commentDB.post_id,
                commentDB.content,
                commentDB.created_at,
                commentDB.updated_at,
                commentDB.likes_count,
                commentDB.dislikes_count
            );
            return comment.toBusinessModel();
        });

        const usersDB = await this.userDatabase.findAllUsers();

        const mapUserIdName = new Map();

        usersDB.forEach((user: any) => {
            mapUserIdName.set(user.id, user);
        });

        const output: GetCommentOutputDTO = comments.map((comment: any) => {
            const user = mapUserIdName.get(comment.creatorId);

            return {
                id: comment.id,
                creator: {
                    id: user.id,
                    nickname: user.nickname,
                },
                content: comment.content,
                postId: comment.postId,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
            };
        });

        return output;
    };

    // POST
    public createComment = async (
        input: CreateCommentInputDTO
    ): Promise<CreateCommentOutputDTO> => {
        const { token, idPost, content } = input;

        // console.log(input);

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const id = this.idGenerator.generate();

        const comment = new Comment(
            id,
            payload.id,
            idPost,
            content,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            0,
            0
        );

        // console.log(comment.toDatabaseModel());

        await this.commentDatabase.createComment(comment.toDatabaseModel());

        // const newComment = comment.toDatabaseModel();

        // await this.commentDatabase.updateComment(
        //     newComment.post_id,
        //     newComment.content,
        //     newComment.updated_at
        // );

        const postDB = await this.postDatabase.findPostById(idPost);

        if (!postDB) {
            throw new NotFoundError(messages.id_post_not_found);
        }

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

        // await this.commentDatabase.updateCommentInPost(
        //     post.getId(),
        //     post.getCommentsCount() + 1
        // );

        try {
            await this.commentDatabase.updateCommentInPost(
                post.getId(),
                post.getCommentsCount() + 1
            );
        } catch (error) {
            console.error('Error updating comments count in post:', error);
            // Tratar ou relançar a exceção conforme necessário
        }

        const output = {
            message: messages.comment_created_sucess,
            content,
        };

        return output;
    };

    // PUT
    public updateComment = async (
        input: UpdateCommentInputDTO
    ): Promise<UpdateCommentOutputDTO> => {
        const { token, idComment, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const commentDB = await this.commentDatabase.findCommentById(idComment);

        if (!commentDB) {
            throw new BadRequestError(messages.comment_not_found);
        }

        if (commentDB.creator_id !== payload.id) {
            throw new BadRequestError(messages.not_authorized);
        }

        const comment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            commentDB.post_id,
            content,
            commentDB.created_at,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            commentDB.likes_count,
            commentDB.dislikes_count
        );

        const newComment = comment.toDatabaseModel();

        await this.commentDatabase.updateComment(
            newComment.id,
            newComment.content,
            newComment.updated_at
        );

        const output: UpdateCommentOutputDTO = {
            message: messages.comment_updated_sucess,
            content,
        };

        return output;
    };

    // DELETE
    public deleteComment = async (
        input: DeleteCommentInputDTO
    ): Promise<DeleteCommentOutputDTO> => {
        const { token, idComment } = input;

        const commentDB = await this.commentDatabase.findCommentById(idComment);

        if (!commentDB) {
            throw new BadRequestError(messages.comment_not_found);
        }

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        if (commentDB.creator_id !== payload.id) {
            throw new BadRequestError(messages.not_authorized);
        }

        await this.commentDatabase.deleteComment(idComment);

        const comment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            commentDB.post_id,
            commentDB.content,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.likes_count,
            commentDB.dislikes_count
        );

        const postDB = await this.postDatabase.findPostById(
            comment.getPostId()
        );

        if (!postDB) {
            throw new NotFoundError(messages.id_post_not_found);
        }

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

        await this.commentDatabase.updateCommentInPost(
            comment.getPostId(),
            post.getCommentsCount() - 1
        );

        const output: DeleteCommentOutputDTO = {
            message: messages.comment_deleted_sucess,
        };

        return output;
    };

    // LIKE E DISLIKE
    public likeOrDislikeComment = async (
        input: LikeOrDislikeCommentInputDTO
    ): Promise<LikeOrDislikeCommentOutputDTO> => {
        // Recebendo e desestruturando os dados do input:
        const { idComment, token, like } = input;

        // Buscando o comment no banco de dados:
        const commentDB = await this.commentDatabase.findCommentById(idComment);

        // Se ele não encontrar o comment, vai retornar undefined e vai lançar um erro:
        if (!commentDB) {
            throw new NotFoundError(messages.comment_not_found);
        }

        // Obtendo o payload através do token:
        const payload = this.tokenManager.getPayload(token);

        // Se o token for inválido vai retornar null
        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        // Esse é o id de quem está logado, pois foi obtido através do token:
        const userId = payload.id;

        // Instanciando commentário com o id que o usuário passou no input:
        const comment = new Comment(
            commentDB.id,
            commentDB.creator_id,
            commentDB.post_id,
            commentDB.content,
            commentDB.created_at,
            commentDB.updated_at,
            commentDB.likes_count,
            commentDB.dislikes_count
        );

        // Se o id do usuário for igual ao id do criador do comment, vai lançar um erro:
        if (commentDB.creator_id === payload.id) {
            throw new BadRequestError(messages.like_not_allowed);
        }

        // Buscando no banco de dados se o usuário já deu like ou dislike no comment:
        const likeDislikeDB = await this.commentDatabase.findLikeOrDislike(
            userId,
            comment.getId()
        );

        // Se o usuário tiver dado like ou dislike, vai retornar 1 ou 0:
        // Porque na tabela sql like e dislike são booleanos:
        const likeSqlite = like ? 1 : 0;

        // Se o usuário não tiver dado like ou dislike, vai criar um novo like ou dislike:
        if (!likeDislikeDB) {
            // Inserindo um like ou um dislike no banco de dados na tabela likes_dislikes:
            await this.commentDatabase.createLikeDislike(
                userId,
                comment.getId(),
                likeSqlite
            );

            // Se o usuário tiver dado like, vai adicionar um like no comment:
            if (like) {
                comment.addLike();
                await this.commentDatabase.updateLikes(
                    idComment,
                    comment.getLikesCount()
                );

                // Se o usuário tiver dado dislike, vai adicionar um dislike no comment:
            } else {
                comment.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.commentDatabase.updateDislikes(
                    idComment,
                    comment.getDislikesCount()
                );
            }

            // Se o usuário já tiver dado like ou dislike, vai atualizar o like ou dislike:
        } else if (likeDislikeDB.like) {
            if (like) {
                // Se o usuário já tiver dado like e clicar em like novamente, vai remover o like:
                await this.commentDatabase.removeLikeDislike(idComment, userId);
                comment.removeLike();

                // Atualizando o número de likes no banco de dados:
                await this.commentDatabase.updateLikes(
                    idComment,
                    comment.getLikesCount()
                );
            } else {
                // Se o usuário já tiver dado like e clicar em dislike, vai atualizar o like para dislike:
                await this.commentDatabase.updateLikeDislike(
                    idComment,
                    userId,
                    likeSqlite
                );
                comment.removeLike();
                comment.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.commentDatabase.updateLikes(
                    idComment,
                    comment.getLikesCount()
                );
                await this.commentDatabase.updateDislikes(
                    idComment,
                    comment.getDislikesCount()
                );
            }
        } else {
            if (!like) {
                // Se o usuário já tiver dado dislike e clicar em dislike novamente, vai remover o dislike:
                await this.commentDatabase.removeLikeDislike(idComment, userId);
                comment.removeDislike();

                // Atualizando o número de dislikes no banco de dados:
                await this.commentDatabase.updateDislikes(
                    idComment,
                    comment.getDislikesCount()
                );
            } else {
                // Se o usuário já tiver dado dislike e clicar em like, vai atualizar o dislike para like:
                await this.commentDatabase.updateLikeDislike(
                    idComment,
                    userId,
                    likeSqlite
                );
                comment.removeDislike();
                comment.addLike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.commentDatabase.updateLikes(
                    idComment,
                    comment.getLikesCount()
                );
                await this.commentDatabase.updateDislikes(
                    idComment,
                    comment.getDislikesCount()
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
