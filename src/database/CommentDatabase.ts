import { CommentDB, LikeDislikeDB } from '../models/Comment';
import { BaseDatabase } from './BaseDatabase';

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = 'comments';
    public static TABLE_LIKES_DISLIKES = 'comments_likes_dislikes';
    public static TABLE_POSTS = 'posts';

    // Estão sendo usados: ✅
    // Não estão sendo usados: ❌
    // Foi mockado: ✔

    // ✅ | ✔
    public async findComments(q: string | undefined): Promise<CommentDB[]> {
        let commentsDB;

        if (q) {
            const result: CommentDB[] = await BaseDatabase.connection(
                CommentDatabase.TABLE_COMMENTS
            )
                .where('content', 'LIKE', `%${q}%`)
                .orderBy('created_at', 'DESC');
            commentsDB = result;
        } else {
            const result: CommentDB[] = await BaseDatabase.connection(
                CommentDatabase.TABLE_COMMENTS
            ).orderBy('created_at', 'DESC');
            commentsDB = result;
        }

        return commentsDB;
    }

    // ✅ | ✔
    public async findCommentById(id: string): Promise<CommentDB | undefined> {
        const [commentDB]: CommentDB[] = await BaseDatabase.connection(
            CommentDatabase.TABLE_COMMENTS
        )
            .where({ id })
            .orderBy('created_at', 'DESC');

        return commentDB;
    }

    // ❌ não usado em CommentBusiness
    // public async findCommentByUserId(id: string): Promise<CommentDB[]> {
    //     const commentsDB: CommentDB[] = await BaseDatabase.connection(
    //         CommentDatabase.TABLE_COMMENTS
    //     ).where({ user_id: id });

    //     return commentsDB;
    // }

    // ❌ não usado em CommentBusiness
    // ✅ | ✔
    public async findCommentByPostId(id: string): Promise<CommentDB[]> {
        const commentsDB: CommentDB[] = await BaseDatabase.connection(
            CommentDatabase.TABLE_COMMENTS
        )
            .where({ post_id: id })
            .orderBy('created_at', 'DESC');

        return commentsDB;
    }

    // ✅ | ✔
    public async createComment(comment: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
            comment
        );
    }

    // ✅ | ✔
    public async updateComment(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .where({ id })
            .update({ content, updated_at });
    }

    // Updando comentário na tabela de posts:
    // public async updateCommentInPost(
    //     id: string,
    //     comments_count: number
    // ): Promise<void> {
    //     await BaseDatabase.connection(CommentDatabase.TABLE_POSTS)
    //         .where({ id })
    //         .update({ comments_count });
    // }

    // ✅ | ✔
    public async updateCommentInPost(
        id: string,
        comments_count: number
    ): Promise<void> {
        if (!id || comments_count < 0) {
            throw new Error('Parâmetros inválidos para updateCommentInPost.');
        }

        await BaseDatabase.connection(CommentDatabase.TABLE_POSTS)
            .where({ id })
            .update({ comments_count });
    }

    // ✅ | ✔
    public async deleteComment(id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ id });
    }

    // ❌ não usado em CommentBusiness
    // public async deleteCommentByPostId(id: string): Promise<void> {
    //     await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
    //         .del()
    //         .where({ post_id: id });
    // }

    // ❌ não usado em CommentBusiness
    // public async deleteCommentByUserId(id: string): Promise<void> {
    //     await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
    //         .del()
    //         .where({ user_id: id });
    // }

    // ❌ não usado em CommentBusiness
    // public async deleteCommentByPostIdAndUserId(
    //     post_id: string,
    //     user_id: string
    // ): Promise<void> {
    //     await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
    //         .del()
    //         .where({ post_id, user_id });
    // }

    // ✅ | ✔
    // LIKE OR DISLIKE COMMENT
    public findLikeOrDislike = async (
        userId: string,
        commentId: string
    ): Promise<any> => {
        const [result] = await BaseDatabase.connection(
            CommentDatabase.TABLE_LIKES_DISLIKES
        )
            .select()
            .where({
                user_id: userId,
                comment_id: commentId,
            });

        return result;
    };

    // ✅ | ✔
    public createLikeDislike = async (
        userId: string,
        commentId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(
            CommentDatabase.TABLE_LIKES_DISLIKES
        ).insert({
            user_id: userId,
            comment_id: commentId,
            like,
        });
    };

    // ✅ | ✔
    public updateLikes = async (
        commentId: string,
        likes: number
    ): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .update({ likes_count: likes })
            .where({ id: commentId });
    };

    // ✅ | ✔
    public updateDislikes = async (
        commentId: string,
        dislikes: number
    ): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .update({ dislikes_count: dislikes })
            .where({ id: commentId });
    };

    // ✅ | ✔
    public removeLikeDislike = async (
        commentId: string,
        userId: string
    ): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                comment_id: commentId,
                user_id: userId,
            });
    };

    // ✅ | ✔
    public updateLikeDislike = async (
        commentId: string,
        userId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .update({
                like,
            })
            .where({
                comment_id: commentId,
                user_id: userId,
            });
    };
}
