-- Active: 1700507012486@@127.0.0.1@3306

-- Criação da tabela users

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        nickname TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );

-- Inserção de dados na tabela users

INSERT INTO
    users (
        id,
        nickname,
        email,
        password,
        role,
        created_at,
        updated_at
    )
VALUES (
        'u001',
        'amanda',
        'amanda@gmail.com',
        'Amanda@123',
        'ADMIN',
        '20-11-2023 15:50:01',
        '20-11-2023 15:50:01'
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

-- Criação da tabela posts

CREATE TABLE
    posts (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL,
        dislikes INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        comment_count INTEGER NOT NULL,
        like_count INTEGER NOT NULL,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Inserção de dados na tabela posts

INSERT INTO
    posts (
        id,
        creator_id,
        content,
        likes,
        dislikes,
        created_at,
        updated_at,
        comment_count,
        like_count
    )
VALUES (
        'p001',
        'u003',
        'texto do post 1',
        0,
        0,
        '20-11-2023 15:50:01',
        '20-11-2023 15:50:01',
        0,
        0
    ), (
        'p002',
        'u001',
        'texto do post 2',
        0,
        0,
        '20-11-2023 16:55:26',
        '20-11-2023 16:55:26',
        0,
        0
    ), (
        'p003',
        'u004',
        'texto do post 3',
        0,
        0,
        '20-11-2023 17:28:40',
        '20-11-2023 17:28:40',
        0,
        0
    ), (
        'p004',
        'u002',
        'texto do post 4',
        0,
        0,
        '20-11-2023 18:20:02',
        '20-11-2023 18:20:02',
        0,
        0
    );

-- Criação da tabela likes_dislikes

CREATE TABLE
    likes_dislikes (
        user_id TEXT,
        post_id TEXT,
        like INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Inserção de dados na tabela likes_dislikes

INSERT INTO
    likes_dislikes (user_id, post_id, like)
VALUES ('u001', 'p001', 1), ('u002', 'p002', 2), ('u001', 'p003', 3), ('u002', 'p004', 3);

-- Criação da tabela comments

CREATE TABLE
    comments (
        id TEXT PRIMARY KEY NOT NULL,
        post_id TEXT NOT NULL,
        creator_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Inserção de dados na tabela comments

INSERT INTO
    comments (
        id,
        post_id,
        creator_id,
        content,
        created_at,
        updated_at
    )
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

DROP TABLE users;

DROP TABLE posts;

DROP TABLE likes_dislikes;

DROP TABLE comments;