import { PostDB } from '../models/Post';
import { BaseDatabase } from './BaseDatabase';

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = 'posts';

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
}
