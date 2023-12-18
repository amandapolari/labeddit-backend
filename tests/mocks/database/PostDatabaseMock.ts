import { format } from 'date-fns';
import { LikeDislikeDB, PostDB } from '../../../src/models/Post';
import { BaseDatabase } from '../../../src/database/BaseDatabase';

const postsMock: PostDB[] = [
    {
        id: 'id-mock-1',
        creator_id: 'id-mock-luan',
        content: 'Post mock 1',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
    },
    {
        id: 'id-mock-2',
        creator_id: 'id-mock-luan',
        content: 'Post mock 2',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
    },
    {
        id: 'id-mock-3',
        creator_id: 'id-mock-amanda',
        content: 'Post mock 3',
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        likes_count: 0,
        dislikes_count: 0,
        comments_count: 0,
    },
];


export class PostDatabaseMock extends BaseDatabase {
    public static TABLE_POSTS = 'posts';

    public async findPosts(q: string | undefined): Promise<PostDB[]> {
        if (q) {
            return postsMock.filter((post) =>
                post.content.toLocaleLowerCase().includes(q.toLocaleLowerCase())
            );
        } else {
            return postsMock;
        }
    }

    public async findPostById(id: string): Promise<PostDB | undefined> {
        return postsMock.filter((post) => post.id === id)[0];
    }

    public async createPost(post: PostDB): Promise<void> {}

    public async updatePost(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {}

    public async deletePost(id: string): Promise<void> {}

    public async deletePostById(id: string): Promise<void> {}

    public async findLikeOrDislike(
        userId: string,
        postId: string
    ): Promise<LikeDislikeDB | undefined | void> {}

    public async createLikeDislike(
        userId: string,
        postId: string,
        like: number
    ): Promise<void> {}

    public async updateLikes(postId: string, likes: number): Promise<void> {}

    public async updateDislikes(
        postId: string,
        dislikes: number
    ): Promise<void> {}

    public async removeLikeDislike(
        userId: string,
        postId: string
    ): Promise<void> {}

    public async updateLikeDislike(
        userId: string,
        postId: string,
        like: number
    ): Promise<void> {}
}
