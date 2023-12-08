import { CommentDB } from '../models/Comment';
import { BaseDatabase } from './BaseDatabase';

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = 'comments';

    public async findComments(q: string | undefined) {
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

    public async findCommentById(id: string): Promise<CommentDB> {
        const [commentDB]: CommentDB[] = await BaseDatabase.connection(
            CommentDatabase.TABLE_COMMENTS
        ).where({ id });

        return commentDB;
    }

    public async findCommentByUserId(id: string): Promise<CommentDB[]> {
        const commentsDB: CommentDB[] = await BaseDatabase.connection(
            CommentDatabase.TABLE_COMMENTS
        ).where({ user_id: id });

        return commentsDB;
    }

    public async findCommentByPostId(id: string): Promise<CommentDB[]> {
        const commentsDB: CommentDB[] = await BaseDatabase.connection(
            CommentDatabase.TABLE_COMMENTS
        ).where({ post_id: id });

        return commentsDB;
    }

    public async createComment(comment: CommentDB): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
            comment
        );
    }

    public async updateComment(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .where({ id })
            .update({ content, updated_at });
    }

    public async deleteComment(id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ id });
    }

    public async deleteCommentByPostId(id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ post_id: id });
    }

    public async deleteCommentByUserId(id: string): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ user_id: id });
    }

    public async deleteCommentByPostIdAndUserId(
        post_id: string,
        user_id: string
    ): Promise<void> {
        await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
            .del()
            .where({ post_id, user_id });
    }
}
