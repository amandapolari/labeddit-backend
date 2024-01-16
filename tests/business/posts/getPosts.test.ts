import { PostBusiness } from '../../../src/business/PostBusiness';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { GetPostsSchema } from '../../../src/dtos/posts/getPostsDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import messages from '../../../src/messages/messages.json';

describe('testing getPosts business', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const postBusiness = new PostBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock()
    );

    // cases of success:
    test('deve retornar uma lista de posts ao buscar todos os posts', async () => {
        const input = GetPostsSchema.parse({
            q: undefined,
            token: 'token-mock-amanda',
        });

        const returned = await postBusiness.getPosts(input);

        const expected = [
            {
                id: 'id-mock-1',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post da Luan',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 3,
                comments: [
                    {
                        content: 'Comentário do Luan no primeiro post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-luan',
                            nickname: 'Luan',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-1',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                    {
                        content: 'Outro comentário do Luan no primeiro post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-luan',
                            nickname: 'Luan',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-2',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                    {
                        content: 'Comentário da Amanda no primeiro post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-amanda',
                            nickname: 'Amanda',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-3',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                ],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-2',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é outro post da Luan',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 2,
                comments: [
                    {
                        content: 'Comentário do Carlinhos no segundo post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-carlinhos',
                            nickname: 'Carlinhos',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-4',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                    {
                        content: 'Comentário da Layla no segundo post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-layla',
                            nickname: 'Layla',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-5',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                ],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-3',
                creator: { id: 'id-mock-amanda', nickname: 'Amanda' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post da Amanda',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 1,
                comments: [
                    {
                        content: 'Comentário da Bia no terceiro post',
                        createdAt: expect.any(String),
                        creator: {
                            id: 'id-mock-bia',
                            nickname: 'Bia',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-6',
                        likesCount: 0,
                        updatedAt: expect.any(String),
                    },
                ],
                isCurrentUserPost: true,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-4',
                creator: { id: 'id-mock-carlinhos', nickname: 'Carlinhos' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post do Carlinhos',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-5',
                creator: { id: 'id-mock-layla', nickname: 'Layla' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post da Layla',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-6',
                creator: { id: 'id-mock-bia', nickname: 'Bia' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post da Bia',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-7',
                creator: { id: 'id-mock-jorginho', nickname: 'Jorginho' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é o post do Jorginho',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
            {
                id: 'id-mock-8',
                creator: { id: 'id-mock-layla', nickname: 'Layla' },
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                content: 'Esse é outro post da Layla',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
                isCurrentUserPost: false,
                userLikedBoolean: null,
            },
        ];

        expect(returned).toEqual(expected);
    });

    // cases of error:
    test('deve disparar um erro 400 caso receba um token inválido', async () => {
        const input = GetPostsSchema.parse({
            token: 'abcd',
        });

        expect.assertions(2);

        try {
            await postBusiness.getPosts(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
