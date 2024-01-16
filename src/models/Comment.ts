export interface CommentDB {
    id: string;
    creator_id: string;
    post_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes_count: number;
    dislikes_count: number;
}

export interface CommentModel {
    id: string;
    creatorId: string;
    postId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    dislikesCount: number;
}

export interface GetComment {
    id: string;
    creator: {
        id: string;
        nickname: string;
    };
    postId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    dislikesCount: number;
    isCurrentUserComment?: boolean;
}

export interface LikeDislikeDB {
    user_id: string;
    comment_id: string;
    like: number;
}

export class Comment {
    constructor(
        protected id: string,
        protected creatorId: string,
        protected postId: string,
        protected content: string,
        protected createdAt: string,
        protected updatedAt: string,
        protected likesCount: number,
        protected dislikesCount: number
    ) {}

    public getId(): string {
        return this.id;
    }

    public getCreatorId(): string {
        return this.creatorId;
    }

    public getPostId(): string {
        return this.postId;
    }

    public getContent(): string {
        return this.content;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public getLikesCount(): number {
        return this.likesCount;
    }

    public getDislikesCount(): number {
        return this.dislikesCount;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setCreatorId(creatorId: string): void {
        this.creatorId = creatorId;
    }

    public setPostId(postId: string): void {
        this.postId = postId;
    }

    public setContent(content: string): void {
        this.content = content;
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public setUpdatedAt(updatedAt: string): void {
        this.updatedAt = updatedAt;
    }

    public setLikesCount(likesCount: number): void {
        this.likesCount = likesCount;
    }

    public setDislikesCount(dislikesCount: number): void {
        this.dislikesCount = dislikesCount;
    }

    // lógica de like e dislike:
    public addLike(): void {
        this.likesCount++;
    }

    public removeLike(): void {
        this.likesCount--;
    }

    public addDislike(): void {
        this.dislikesCount++;
    }

    public removeDislike(): void {
        this.dislikesCount--;
    }
    // -------------------------

    public toDatabaseModel(): CommentDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            likes_count: this.likesCount,
            dislikes_count: this.dislikesCount,
        };
    }

    public toBusinessModel(): CommentModel {
        return {
            id: this.id,
            creatorId: this.creatorId,
            postId: this.postId,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            likesCount: this.likesCount,
            dislikesCount: this.dislikesCount,
        };
    }

    // public async toGetComment(
    //     creator: {
    //         id: string;
    //         nickname: string;
    //     }
    // ): Promise<GetComment> {
    //     return {
    //         id: this.id,
    //         creator,
    //         postId: this.postId,
    //         content: this.content,
    //         createdAt: this.createdAt,
    //         updatedAt: this.updatedAt,
    //         likesCount: this.likesCount,
    //         dislikesCount: this.dislikesCount,
    //     };
    // }

    // public static fromDatabaseModel(data: any): CommentModel[] {
    //     return data.map((item: any) => {
    //         return {
    //             id: item.id,
    //             creatorId: item.creator_id,
    //             postId: item.post_id,
    //             content: item.content,
    //             createdAt: item.created_at,
    //             updatedAt: item.updated_at,
    //             likesCount: item.likes_count,
    //             dislikesCount: item.dislikes_count,
    //         };
    //     });
    // }
}
