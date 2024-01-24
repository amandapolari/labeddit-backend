<h1 align="center">Projeto Labeddit Backend</h1>
<div align="center">

![funcionamento-site-gif](./src/images/postman-endpoints.gif)

Clique [**AQUI**](https://documenter.getpostman.com/view/28316385/2s9Ykq713o) para consultar a documentação da API!

<br>
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=nodejs,typescript,express,mysql,sqlite,postman," style="height: 25px;"/>
  </a>

<br>

<p align="center"><strong>Status do Projeto:<br> <i>Concluído</i> ✔</p>

> Clique [aqui](https://github.com/amandapolari/labeddit-frontend) para acessar repositório do Front-End do projeto Labeddit

</div>

## Índice

-   [Resumo do Projeto](#resumo-do-projeto)
-   [Banco de Dados](#banco-de-dados)
-   [Tecnologias Utilizadas](#tecnologias-utilizadas)
-   [Instalação](#instalação)
-   [Inicialização](#inicialização)
-   [Testes](#testes)
-   [Endpoints](#endpoints)
    -   [User](#users)
        -   [signup](#signup)
        -   [login](#login)
        -   [getUsers](#getusers)
        -   [updateUser](#updateuser)
        -   [deleteUser](#deleteuser)
    -   [Posts](#posts)
        -   [createPost](#createpost)
        -   [getPosts](#getposts)
        -   [getPostById](#getpostbyid)
        -   [updatePost](#updatepost)
        -   [deletePost](#deletepost)
        -   [likeOrDislikePost](#likeordislikepost)
    -   [Comments](#comments)
        -   [createComment](#createcomments)
        -   [getComments](#getcomments)
        -   [updateComment](#updatecomments)
        -   [deleteComment](#deletecomments)
        -   [likeOrDislikeComment](#likeordislikecomment)
-   [Lista de Requisitos do Projeto](#lista-de-requisitos-do-projeto)
-   [Desenvolvedora](#desenvolvedora)

## Resumo do Projeto

[🔼](#projeto-labeddit-backend)

O Labeddit é uma plataforma de interação social, desenvolvida em `Node.js` com `Express`. O projeto segue uma `arquitetura em camadas`, utilizando bibliotecas como date-fns para manipulação de datas, além de padrões de `DTO (Data Transfer Object)` para comunicação entre as camadas.

### Usuários:

-   Cada usuário possui um nickname exclusivo e um endereço de e-mail único.
-   A autenticação é realizada por meio de tokens JWT, gerenciados pelo serviço `TokenManager`.
-   Os usuários podem se cadastrar, realizar login, atualizar suas informações e excluir suas contas.
-   Existem diferentes níveis de acesso, como administrador (ADMIN) e usuário normal (NORMAL).

### Posts:

-   Os posts representam publicações feitas pelos usuários na plataforma.
-   Cada post possui conteúdo, contador de likes, dislikes e comentários, além de informações sobre seu criador e data de criação.
-   Os usuários podem criar, visualizar, editar e excluir posts.
-   Os likes e dislikes são gerenciados por meio do serviço `PostBusiness`.

### Comentários:

-   Os comentários são interações realizadas por usuários em posts específicos.
-   Cada comentário possui conteúdo, contador de likes e dislikes, além de informações sobre seu criador e data de criação.
-   Os usuários podem visualizar, criar, editar e excluir seus comentários.
-   O serviço `CommentBusiness` gerencia as operações relacionadas a comentários, incluindo likes e dislikes.

### Segurança:

-   A segurança é mantida por meio da geração de IDs únicos com o serviço `IdGenerator` e pela criptografia de senhas com o serviço `HashManager`.
-   Tokens JWT são utilizados para autenticação e autorização de usuários.

O Labeddit proporciona uma experiência interativa, permitindo que usuários compartilhem suas ideias por meio de posts e comentários, interajam com o conteúdo de outros usuários e expressem suas opiniões por meio de likes e dislikes. A estrutura modular do projeto facilita a manutenção e expansão futura.

## Banco de Dados

### Modelagem:

[🔼](#projeto-labeddit-backend)

Clique [aqui](https://docs.google.com/spreadsheets/d/1-r3PXAjKqJAetynaFoNCvE_exUwasI0kEsozdG2s07w/edit?usp=sharing) para visualizar a modelagem do banco de dados no Google Sheets. Ou se preferir, clique [aqui](https://dbdiagram.io/d/Modelagem-de-Dados-Labeddit-655bba433be1495787607dba) para visualizar a modelagem do banco de dados e como ela se relaciona na plataforma dbdiagram.io

![Modelagem Bando de Dados](./src/images/Modelagem%20de%20Dados%20Labeddit.png)

## Tecnologias Utilizadas

[🔼](#projeto-labeddit-backend)

-   TypeScript
-   Node.js
-   Express
-   Knex
-   SQLite3
-   Jest
-   Bcrypt.js
-   Cors
-   Date-fns
-   Dotenv
-   Jsonwebtoken
-   Uuid
-   Zod

## Instalação

[🔼](#projeto-labeddit-backend)

Ter instalado o `node.js`, o `npm` e rodar o seguinte comando:

```bash
npm install
```

## Inicialização

[🔼](#projeto-labeddit-backend)

Para rodar o servidor localmente digite o seguinte comando:

```bash
npm run dev
```

## Testes

[🔼](#projeto-labeddit-backend)

Para rodar todos os testes:

```bash
npm run test
```

Para rodar todos os testes com mais detalhes:

```bash
npm run test:verbose
```

Para rodar a cobertura de todos os testes:

```bash
npm run test:coverage
```

Além disso criei um script para cada arquivo de teste, caso deseje rodar cada um deles separadamente digite no bash `npm run test:` e em seguida o nome do arquivo que deseja testar, por exemplo, para testar login:<br>
`npm run test:login`

Segue a lista dos testes disponíveis:

-   login
-   signup
-   getUsers
-   updateUser
-   deleteUser
-   getPosts
-   createPost
-   updatePost
-   deletePost
-   likeOrDislikePost
-   createComment
-   getComments
-   updateComment
-   deleteComment
-   likeOrDislikeComment

## Endpoints

Clique [**AQUI**](https://documenter.getpostman.com/view/28316385/2s9Ykq713o) para visualizar a documentação da [**API LABEDDIT**](https://documenter.getpostman.com/view/28316385/2s9Ykq713o).

A base URL para esta API é **`https://labeddit-backend-kul7.onrender.com`**

Os endpoints estão divididos em pastas de acordo com o que é gerenciado.
A API fornece os seguintes endpoints:

### Users

### **signup**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo criar uma conta de usuário e cadastrá-la no sistema. Para uma requisição bem-sucedida:<br>

`nickname`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Deve ser único no sistema
-   Mínimo 2 caracteres
-   Máximo de 20 caracteres

`email` <br>

-   Obrigatório
-   Deve ser do tipo string
-   Deve ser único no sistema
-   Deve obedecer o formato de um e-mail

`password`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 4 caracteres
-   Máximo de 20 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /users/signup
-   Método HTTP: POST
-   Acesso: Público
-   Enviar via body: `nickname`, `email` e `password`

**INPUT:**

```json
{
    "nickname": "Amanda",
    "email": "amanda@gmail.com",
    "password": "Amanda@123"
}
```

**OUTPUT:**

```json
{
    "message": "Seu cadastro foi realizado com sucesso. Bem-vindo(a) à nossa comunidade!",
    "token": "eyJhbGciOiJ..."
}
```

### **login**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo realizar o login do usuário no sistema. Para uma requisição bem-sucedida:

`email`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Deve obedecer o formato de um e-mail

`password`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 4 caracteres
-   Máximo de 20 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /users/login<br>
-   Método HTTP: POST<br>
-   Acesso: Público<br>
-   Enviar via body: `email` e `password`

**INPUT:**

```json
{
    "email": "amanda@gmail.com",
    "password": "Amanda@123"
}
```

**OUTPUT:**

```json
{
    "message": "Login realizado com sucesso!",
    "token": "eyJhbGciOiJ..."
}
```

### **getUsers**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo visualizar as informações de todos os usuários cadastrados no sistema. Trata-se de um endpoint protegido para que apenas usuários administradores possam acessá-lo. Para uma requisição bem-sucedida:

`Authorization`<br>

-   Token de admin

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /users<br>
-   Método HTTP: GET<br>
-   Acesso: Privado<br>
-   Enviar via headers.authorization: `token_de_autenticação_admin`

**INPUT:**

```json

// headers.authorization = "token_de_autenticação_admin"

```

**OUTPUT:**

```json
[
    {
        "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
        "nickname": "Amanda",
        "email": "amanda@gmail.com",
        "password": "$2a$12$3wGSuFSaYs70hxf6Rezwhu8ZgIm7m2v/hOJ2oMbFJCWOXcbNYHoLm",
        "role": "ADMIN",
        "createdAt": "07-12-2023 16:17:44",
        "updatedAt": "07-12-2023 16:17:44"
    },
    {
        "id": "6c91ced1-4922-4525-9cf3-264cced747b9",
        "nickname": "Morgana",
        "email": "morgana@gmail.com",
        "password": "$2a$12$tvuT4OBwbsoJUthbl48ATueWN9K9VDkJ1CYtZyztOj4fkMgoJKwju",
        "role": "NORMAL",
        "createdAt": "20-12-2023 12:50:49",
        "updatedAt": "20-12-2023 12:50:49"
    }
]
```

### **updateUser**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo atualizar os dados do usuário no sistema. Para uma requisição bem-sucedida:

`nickname`<br>

-   Opcional
-   Deve ser do tipo string
-   Deve ser único no sistema
-   Mínimo 2 caracteres
-   Máximo de 20 caracteres

`email`<br>

-   Opcional
-   Deve ser do tipo string
-   Deve obedecer o formato de um e-mail

`password`<br>

-   Opcional
-   Deve ser do tipo string
-   Mínimo de 4 caracteres
-   Máximo de 20 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /users/:id<br>
-   Método HTTP: PUT<br>
-   Acesso: privado<br>
-   Enviar via body os dados que deseja alterar: `nickname` , `email` e `password`
-   Enviar via params o `id` do usuário que deseja editar
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id

{
    "nickname": "lily",
    "email": "lily@gmail.com",
    "password": "Lily@123"
}
```

**OUTPUT:**

```json
{
    "message": "Dados do usuário atualizados com sucesso",
    "user": {
        "nickname": "lily",
        "email": "lily@gmail.com",
        "updatedAt": "20-12-2023 13:03:03"
    }
}
```

### **deleteUser**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo deletar a conta de um usuário no sistema. Para uma requisição bem-sucedida:

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /users/:id<br>
-   Método HTTP: DELETE<br>
-   Acesso: privado<br>
-   Enviar via params o `id` do usuário que deseja excluir
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id
```

**OUTPUT:**

```json
{
    "message": "Conta deletada com sucesso"
}
```

### Posts

### **createPost**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo criar e cadastrar um post no sistema. Para uma requisição bem-sucedida:

`token`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Deve ter sido obtida ao se cadastrar ou se logar no sistema

`content`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 1 caracteres
-   Máximo de 350 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts<br>
-   Método HTTP: POST<br>
-   Acesso: Privado<br>
-   Enviar via params: `token`
-   Enviar via body: `content`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
{
    "content": "O Natal está chegando!"
}
```

**OUTPUT:**

```json
{
    "message": "Post criado com sucesso",
    "content": "O Natal está chegando!"
}
```

### **getPosts**

[🔼](#projeto-labeddit-backend)

Está requisição tem como objetivo visualizar todos os posts cadastrados no sistema. Para uma requisição bem sucedida é necessário fornecer o seu token via headers. Caso não forneça um token, não terá acesso à visualização dos posts.

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts<br>
-   Método HTTP: GET<br>
-   Acesso: Privado<br>
-   Enviar via params: `token`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
```

**OUTPUT:**

```json
[
    {
        "id": "f2c16e1e-da71-4f32-842e-c6b0c19e6bf5",
        "creator": {
            "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
            "nickname": "Amanda"
        },
        "createdAt": "19-12-2023 18:34:31",
        "updatedAt": "19-12-2023 18:34:31",
        "content": "O Natal está chegando!",
        "likesCount": 0,
        "dislikesCount": 0,
        "commentsCount": 0,
        "comments": []
    },
    {
        "id": "beb25b55-6527-4e32-9e31-5e6a0cd92db2",
        "creator": {
            "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
            "nickname": "Amanda"
        },
        "createdAt": "08-12-2023 15:36:03",
        "updatedAt": "08-12-2023 15:36:03",
        "content": "Nossa, fazer uma aplicação full stack do zero cansa demais",
        "likesCount": 0,
        "dislikesCount": 1,
        "commentsCount": 1,
        "comments": [
            {
                "id": "11e9e18b-5782-4a4d-afb3-b7beb0e47cd8",
                "creator": {
                    "id": "0be952fe-2fef-4832-a240-6e285ecea231",
                    "nickname": "Belinha"
                },
                "createdAt": "08-12-2023 15:38:04",
                "updatedAt": "08-12-2023 16:22:44",
                "content": "Acabaaa pelo amor de Deeeus",
                "likesCount": 0,
                "dislikesCount": 0
            }
        ]
    },
    {
        "id": "59649f25-6ce5-4a01-b57d-ae0f1d5010a1",
        "creator": {
            "id": "22a455e6-f8c5-490c-a169-31644ac5b378",
            "nickname": "Jorginho"
        },
        "createdAt": "08-12-2023 14:14:31",
        "updatedAt": "08-12-2023 14:14:31",
        "content": "Meu Primeiro Comentário",
        "likesCount": 0,
        "dislikesCount": 0,
        "commentsCount": 2,
        "comments": [
            {
                "id": "624edb9e-79e1-44db-8cca-02fe9f156cd8",
                "creator": {
                    "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
                    "nickname": "Amanda"
                },
                "createdAt": "08-12-2023 14:53:22",
                "updatedAt": "08-12-2023 14:53:22",
                "content": "Meu SEGUNDO Comentário!",
                "likesCount": 1,
                "dislikesCount": 0
            },
            {
                "id": "f53011da-5cbe-4e98-806c-04072bd7c824",
                "creator": {
                    "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
                    "nickname": "Amanda"
                },
                "createdAt": "08-12-2023 14:24:29",
                "updatedAt": "08-12-2023 14:24:29",
                "content": "Meu Primeiro Comentário!",
                "likesCount": 0,
                "dislikesCount": 0
            }
        ]
    },
    {
        "id": "24c5057b-8143-4358-95b7-6b25aa771fa1",
        "creator": {
            "id": "22a455e6-f8c5-490c-a169-31644ac5b378",
            "nickname": "Jorginho"
        },
        "createdAt": "07-12-2023 18:59:03",
        "updatedAt": "07-12-2023 18:59:03",
        "content": "Meu Primeiro Post Criado no Postman no Projeto Labeddit",
        "likesCount": 0,
        "dislikesCount": 0,
        "commentsCount": 0,
        "comments": []
    }
]
```

### **getPostById**

[🔼](#projeto-labeddit-backend)

Está requisição tem como objetivo visualizar um post com id fornecido. Para uma requisição bem sucedida é necessário fornecer o seu token via headers e o id do post via path params. Caso não forneça um token ou o id do post, não terá acesso à visualização dos posts.

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts/:id<br>
-   Método HTTP: GET<br>
-   Acesso: Privado<br>
-   Enviar via params o id do post que deseja visualizar
-   Enviar via headers.authorization: token_de_autenticação

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id
```

**OUTPUT:**

```json
{
    "id": "a3662cf6-1526-48fe-ba27-cde2ca91ed4d",
    "creator": {
        "id": "e296f01c-a218-49d7-b719-75f441ea5953",
        "nickname": "Marcinho"
    },
    "createdAt": "09-01-2024 15:32:25",
    "updatedAt": "09-01-2024 15:32:25",
    "content": "Igual a você eu sei que não tem!",
    "likesCount": 1,
    "dislikesCount": 0,
    "commentsCount": 2,
    "comments": [
        {
            "id": "9ad516fc-953d-4cd9-ad4c-cc6ee39bdb6d",
            "creator": {
                "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
                "nickname": "Amanda"
            },
            "createdAt": "09-01-2024 15:40:57",
            "updatedAt": "09-01-2024 15:40:57",
            "content": "De zero a dez te dou nota cem!",
            "likesCount": 1,
            "dislikesCount": 0
        },
        {
            "id": "4c66b184-e949-406d-91bf-b62bdacda1eb",
            "creator": {
                "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
                "nickname": "Amanda"
            },
            "createdAt": "09-01-2024 16:45:37",
            "updatedAt": "09-01-2024 16:45:37",
            "content": "E até hoje lembro de ti e ainda sonho que um dia você vem!",
            "likesCount": 0,
            "dislikesCount": 0
        }
    ]
}
```

### **updatePost**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo realizar atualizações em um post. Para uma requisição bem-sucedida:

`content`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 1 caracteres
-   Máximo de 350 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts/:id<br>
-   Método HTTP: PUT<br>
-   Acesso: privado<br>
-   Enviar via body: `content`
-   Enviar via params o `id` do post que deseja editar
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id

{
    "content": "Texto do post editado"
}
```

**OUTPUT:**

```json
{
    "message": "Post atualizado com sucesso",
    "content": "Texto do post editado"
}
```

### **deletePost**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo deletar um post. Para uma requisição bem-sucedida:

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts/:id<br>
-   Método HTTP: DELETE<br>
-   Acesso: privado<br>
-   Enviar via params o `id` do comentário que deseja deletar
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id
```

**OUTPUT:**

```json
{
    "message": "Post deletado com sucesso"
}
```

### **likeOrDislikePost**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo dar um like em um post. Para uma requisição bem-sucedida:

`idPost`<br>

-   Obrigatório
-   Deve ser do tipo string

`token`<br>

-   Obrigatório
-   Deve ser do tipo string

`like`<br>

-   Obrigatório
-   Deve ser do tipo booleano

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /posts/:id/like<br>
-   Método HTTP: PUT<br>
-   Acesso: privado<br>
-   Enviar via body: `like` (true para like, false para dislike)
-   Enviar via params o `idPost` do post que deseja dar like
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id

// LIKE
{
    "like": true
}

// OU

// DISLIKE
{
    "like": false
}

```

**OUTPUT:**

```json
// LIKE
{
    "message": "Curtida registrada com sucesso"
}

// OU

// DISLIKE
{
    "message": "Descurtida registrada com sucesso"
}
```

### Comments

### **createComments**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo criar e cadastrar um comentário no sistema. Para uma requisição bem-sucedida:

`token`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Deve ter sido obtida ao se cadastrar ou se logar no sistema

`content`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 1 caracteres
-   Máximo de 350 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /comments<br>
-   Método HTTP: POST<br>
-   Acesso: Privado<br>
-   Enviar via params: `token`
-   Enviar via body: `content`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id
{
    "content": "Eu amo esse livro"
}
```

**OUTPUT:**

```json
{
    "message": "Comentário criado com sucesso",
    "content": "Eu amo esse livro"
}
```

### **getComments**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo visualizar as informações de todos os comentários cadastrados no sistema. Para uma requisição bem-sucedida:

`Authorization`<br>

-   token_de_autenticação

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /comments<br>
-   Método HTTP: GET<br>
-   Acesso: Privado<br>
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json

// headers.authorization = "token_de_autenticação"

```

**OUTPUT:**

```json
[
    {
        "id": "e1656e9b-c836-4bc3-b176-dbeb0f6dbfb4",
        "creator": {
            "id": "c5d445c5-ad1e-4f6a-9d80-2672c7abd9fd",
            "nickname": "Amanda"
        },
        "content": "Eu amo esse livro",
        "postId": "6afef40f-97f8-4c02-aafb-515b3ab59d19",
        "createdAt": "20-12-2023 13:27:18",
        "updatedAt": "20-12-2023 13:27:18",
        "likesCount": 0,
        "dislikesCount": 0
    }
]
```

### **deleteComments**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo deletar um comentário no sistema. Para uma requisição bem-sucedida:

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /comments/:id<br>
-   Método HTTP: DELETE<br>
-   Acesso: privado<br>
-   Enviar via params o `id` do comentário que deseja excluir
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id
```

**OUTPUT:**

```json
{
    "message": "Comentário deletado com sucesso"
}
```

### **updateComments**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo realizar atualizações em um comentário. Para uma requisição bem-sucedida:

`content`<br>

-   Obrigatório
-   Deve ser do tipo string
-   Mínimo de 1 caracteres
-   Máximo de 350 caracteres

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /comments/:id<br>
-   Método HTTP: PUT<br>
-   Acesso: privado<br>
-   Enviar via body: `content`
-   Enviar via params o `id` do comentário que deseja editar
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id

{
    "content": "Texto do comentário editado"
}
```

**OUTPUT:**

```json
{
    "message": "Comentário atualizado com sucesso",
    "content": "Texto do comentário editado"
}
```

### **likeOrDislikeComment**

[🔼](#projeto-labeddit-backend)

Este endpoint tem como objetivo dar um like em um comentário. Para uma requisição bem-sucedida:

`idComment`<br>

-   Obrigatório
-   Deve ser do tipo string

`token`<br>

-   Obrigatório
-   Deve ser do tipo string

`like`<br>

-   Obrigatório
-   Deve ser do tipo booleano

#### EXEMPLO DE REQUISIÇÃO:

-   URL: /comments/:id/like<br>
-   Método HTTP: PUT<br>
-   Acesso: privado<br>
-   Enviar via body: `like`
-   Enviar via params o `idComment` do comentário que deseja dar like
-   Enviar via headers.authorization: `token_de_autenticação`

**INPUT:**

```json
// headers.authorization = "token_de_autenticação"
// params :id

// LIKE
{
    "like": true
}

// OU

// DISLIKE
{
    "like": false
}

```

**OUTPUT:**

```json
// LIKE
{
    "message": "Curtida registrada com sucesso"
}

// OU

// DISLIKE
{
    "message": "Descurtida registrada com sucesso"
}
```

## Lista de Requisitos do Projeto

[🔼](#projeto-labeddit-backend)

### Back-end:

[✔] Endpoints seguindo as boas práticas HTTP <br>
[✔] Uso do ExpressJS, Typescript e SQLite <br>
[✔] Cobertura de testes (pelo menos 70% da Business) <br>
[✔] API deployada <br>
[✔] Documentação README e POSTMAN <br>

## Desenvolvedora

[🔼](#projeto-labeddit-backend)

Este projeto foi desenvolvido por:

**Amanda Polari** : [LinkedIn](https://www.linkedin.com/in/amandapolari/) | [GitHub](https://github.com/amandapolari)
