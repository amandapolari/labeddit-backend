export interface UserDB {
    id: string;
    nickname: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface UserModel {
    id: string;
    nickname: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export enum USER_ROLES {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN',
}

export interface TokenPayload {
    id: string;
    nickname: string;
    role: USER_ROLES;
}

export class User {
    constructor(
        protected id: string,
        protected nickname: string,
        protected email: string,
        protected password: string,
        protected role: string,
        protected createdAt: string,
        protected updatedAt: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getNickname(): string {
        return this.nickname;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRole(): string {
        return this.role;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setNickname(nickname: string): void {
        this.nickname = nickname;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public setUpdatedAt(updatedAt: string): void {
        this.updatedAt = updatedAt;
    }
}
