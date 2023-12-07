export interface PostDB {
    id: string;
    creator_id: string;
    content: string;
    created_at: string;
    updated_at: string;
    likes_count: number;
    dislikes_count: number;
    comments_count: number;
}

export interface PostModel {
    id: string;
    creatorId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    dislikesCount: number;
    commentsCount: number;
}

export class Post {
    constructor(
        protected id: string,
        protected creatorId: string,
        protected content: string,
        protected createdAt: string,
        protected updatedAt: string,
        protected likesCount: number,
        protected dislikesCount: number,
        protected commentsCount: number
    ) {}

    public getId(): string {
        return this.id;
    }

    public getCreatorId(): string {
        return this.creatorId;
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

    public getCommentsCount(): number {
        return this.commentsCount;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setCreatorId(creatorId: string): void {
        this.creatorId = creatorId;
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

    public setCommentsCount(commentsCount: number): void {
        this.commentsCount = commentsCount;
    }

    public toDatabaseModel(): PostDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            likes_count: this.likesCount,
            dislikes_count: this.dislikesCount,
            comments_count: this.commentsCount,
        };
    }

    public toBusinessModel(): PostModel {
        return {
            id: this.id,
            creatorId: this.creatorId,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            likesCount: this.likesCount,
            dislikesCount: this.dislikesCount,
            commentsCount: this.commentsCount,
        };
    }
}
