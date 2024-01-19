-- Active: 1705636111347@@127.0.0.1@3306

----------------------------------------------------------------------------------------------

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        nickname TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        likes_count INTEGER NOT NULL,
        dislikes_count INTEGER NOT NULL,
        comments_count INTEGER NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        post_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        likes_count INTEGER NOT NULL,
        dislikes_count INTEGER NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    posts_likes_dislikes (
        user_id TEXT,
        post_id TEXT,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    comments_likes_dislikes (
        user_id TEXT,
        comment_id TEXT,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

----------------------------------------------------------------------------------------------

INSERT INTO users
VALUES (
        'u001',
        'amanda',
        'amanda@gmail.com',
        'Amanda@123',
        'ADMIN',
        '07-12-2023 10:37:11',
        '07-12-2023 10:37:11'
    ), (
        'u002',
        'luan',
        'luan@gmail.com',
        'Luan@123',
        'NORMAL',
        '20-11-2023 16:55:26',
        '20-11-2023 16:55:26'
    ), (
        'u003',
        'samuel',
        'samuel@gmail.com',
        'Samuel@123',
        'NORMAL',
        '20-11-2023 17:28:40',
        '20-11-2023 17:28:40'
    ), (
        'u004',
        'lily',
        'lily@gmail.com',
        'Lily@123',
        'NORMAL',
        '20-11-2023 18:20:02',
        '20-11-2023 18:20:02'
    );

INSERT INTO posts
VALUES (
        'p001',
        'u003',
        'texto do post 1',
        '20-11-2023 15:50:01',
        '20-11-2023 15:50:01',
        0,
        0,
        0
    ), (
        'p002',
        'u001',
        'texto do post 2',
        '20-11-2023 16:55:26',
        '20-11-2023 16:55:26',
        0,
        0,
        0
    ), (
        'p003',
        'u004',
        'texto do post 3',
        '20-11-2023 17:28:40',
        '20-11-2023 17:28:40',
        0,
        0,
        0
    ), (
        'p004',
        'u002',
        'texto do post 4',
        '20-11-2023 18:20:02',
        '20-11-2023 18:20:02',
        0,
        0,
        0
    );

INSERT INTO comments
VALUES (
        'c001',
        'p001',
        'u003',
        'texto do comentário 1',
        '20-11-2023 15:50:01',
        '20-11-2023 15:50:01'
    ), (
        'c002',
        'p002',
        'u001',
        'texto do comentário 2',
        '20-11-2023 16:55:26',
        '20-11-2023 16:55:26'
    ), (
        'c003',
        'p003',
        'u004',
        'texto do comentário 3',
        '20-11-2023 17:28:40',
        '20-11-2023 17:28:40'
    ), (
        'c004',
        'p004',
        'u002',
        'texto do comentário 4',
        '20-11-2023 18:20:02',
        '20-11-2023 18:20:02'
    );

INSERT INTO
    posts_likes_dislikes
VALUES ('u001', 'p001', 1), ('u002', 'p002', 0), ('u001', 'p003', 0), ('u002', 'p004', 1);

INSERT INTO
    comments_likes_dislikes
VALUES ('u001', 'c001', 1), ('u002', 'p002', 1), ('u001', 'c003', 1), ('u002', 'c004', 0);

----------------------------------------------------------------------------------------------

DROP TABLE users;

DROP TABLE posts;

DROP TABLE comments;

DROP TABLE posts_likes_dislikes;

DROP TABLE comments_likes_dislikes;