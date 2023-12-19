import { format } from 'date-fns';
import { CommentDB } from '../../../src/models/Comment';
import { BaseDatabase } from '../../../src/database/BaseDatabase';

const commentsMock: CommentDB[] = [
    {
        id: 'id-mock-1',
        creator_id: 'id-mock-luan',
        post_id: 'id-mock-1',
        content: 'Comentário do Luan no primeiro post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
    {
        id: 'id-mock-2',
        creator_id: 'id-mock-luan',
        post_id: 'id-mock-1',
        content: 'Outro comentário do Luan no primeiro post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
    {
        id: 'id-mock-3',
        creator_id: 'id-mock-amanda',
        post_id: 'id-mock-1',
        content: 'Comentário da Amanda no primeiro post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
    {
        id: 'id-mock-4',
        creator_id: 'id-mock-carlinhos',
        post_id: 'id-mock-2',
        content: 'Comentário do Carlinhos no segundo post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
    {
        id: 'id-mock-5',
        creator_id: 'id-mock-layla',
        post_id: 'id-mock-2',
        content: 'Comentário da Layla no segundo post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
    {
        id: 'id-mock-6',
        creator_id: 'id-mock-bia',
        post_id: 'id-mock-3',
        content: 'Comentário da Bia no terceiro post',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
    },
];

export class CommentDatabaseMock extends BaseDatabase {
    public static TABLE_COMMENTS = 'comments';

    public async findComments(q: string | undefined): Promise<CommentDB[]> {
        if (q) {
            return commentsMock.filter((comment) =>
                comment.content
                    .toLocaleLowerCase()
                    .includes(q.toLocaleLowerCase())
            );
        } else {
            return commentsMock;
        }
    }

    public async findCommentById(id: string): Promise<CommentDB | undefined> {
        return commentsMock.filter((comment) => comment.id === id)[0];
    }

    public async createComment(comment: CommentDB): Promise<void> {
        return;
    }

    public async updateComment(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {
        return;
    }

    public async deleteComment(id: string): Promise<void> {
        return;
    }

    public async findLikeOrDislike(
        userId: string,
        commentId: string
    ): Promise<any> {
        return;
    }

    public async createLikeDislike(
        userId: string,
        commentId: string,
        like: number
    ): Promise<void> {
        return;
    }

    public async updateLikes(commentId: string, likes: number): Promise<void> {
        return;
    }

    public async updateDislikes(
        commentId: string,
        dislikes: number
    ): Promise<void> {
        return;
    }

    public async removeLikeDislike(
        userId: string,
        commentId: string
    ): Promise<void> {
        return;
    }

    public async updateLikeDislike(
        commentId: string,
        userId: string,
        like: number
    ): Promise<void> {
        return;
    }
}
