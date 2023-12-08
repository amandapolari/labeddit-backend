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

export class CommentBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private commentDatabase: CommentDatabase,
        private userDatabase: UserDatabase
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
        const { token, postId, content } = input;

        console.log(input);

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const id = this.idGenerator.generate();

        const comment = new Comment(
            id,
            payload.id,
            postId,
            content,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            0,
            0
        );

        await this.commentDatabase.createComment(comment.toDatabaseModel());

        const newComment = comment.toDatabaseModel();

        await this.commentDatabase.updateComment(
            newComment.post_id,
            newComment.content,
            newComment.updated_at
        );

        const output = {
            message: messages.comment_updated_sucess,
            content,
        };

        return output;
    };

    // PUT
    public updateComment = async (
        input: UpdateCommentInputDTO
    ): Promise<UpdateCommentOutputDTO> => {
        const { token, commentId, content } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const commentDB = await this.commentDatabase.findCommentById(commentId);

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
        const { token, commentId } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const commentDB = await this.commentDatabase.findCommentById(commentId);

        if (commentDB.creator_id !== payload.id) {
            throw new BadRequestError(messages.not_authorized);
        }

        await this.commentDatabase.deleteComment(commentId);

        const output: DeleteCommentOutputDTO = {
            message: messages.comment_deleted_sucess,
        };

        return output;
    };
}
