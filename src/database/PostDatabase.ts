import { LikeDislikeDB, PostDB } from '../models/Post';
import { BaseDatabase } from './BaseDatabase';

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = 'posts';
    public static TABLE_LIKES_DISLIKES = 'posts_likes_dislikes';

    public async findPosts(q: string | undefined) {
        let postsDB;

        if (q) {
            const result: PostDB[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            )
                .where('content', 'LIKE', `%${q}%`)
                .orderBy('created_at', 'DESC');
            postsDB = result;
        } else {
            const result: PostDB[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            ).orderBy('created_at', 'DESC');
            postsDB = result;
        }

        return postsDB;
    }

    public async findPostById(id: string): Promise<PostDB> {
        const [postDB]: PostDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_POSTS
        ).where({ id });

        return postDB;
    }

    public async findPostByUserId(id: string): Promise<PostDB[]> {
        const postsDB: PostDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_POSTS
        ).where({ user_id: id });

        return postsDB;
    }

    public async createPost(post: PostDB): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(post);
    }

    public async updatePost(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .update({ content, updated_at });
    }

    public async deletePost(id: string): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .del()
            .where({ id });
    }

    public async deletePostById(id: string): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .del();
    }

    public findLikeOrDislike = async (
        userId: string,
        postId: string
    ): Promise<LikeDislikeDB | undefined> => {
        const [result]: LikeDislikeDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_LIKES_DISLIKES
        )
            .select()
            .where({
                user_id: userId,
                post_id: postId,
            });

        return result;
    };

    public createLikeDislike = async (
        userId: string,
        postId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
            {
                user_id: userId,
                post_id: postId,
                like,
            }
        );
    };

    public updateLikes = async (
        postId: string,
        likes: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update({ likes_count: likes })
            .where({ id: postId });
    };

    public updateDislikes = async (
        postId: string,
        dislikes: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update({ dislikes_count: dislikes })
            .where({ id: postId });
    };

    public removeLikeDislike = async (
        postId: string,
        userId: string
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                post_id: postId,
                user_id: userId,
            });
    };

    public updateLikeDislike = async (
        postId: string,
        userId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update({
                like,
            })
            .where({
                post_id: postId,
                user_id: userId,
            });
    };
}
