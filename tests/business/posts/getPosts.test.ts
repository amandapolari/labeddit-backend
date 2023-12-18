import { PostBusiness } from '../../../src/business/PostBusiness';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { GetPostsSchema } from '../../../src/dtos/posts/getPostsDto';
import { format } from 'date-fns';
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
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                content: 'Post mock 1',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 3,
                comments: [
                    {
                        content: 'Comment mock 1',
                        createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                        creator: {
                            id: 'id-mock-luan',
                            nickname: 'Luan',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-1',
                        likesCount: 0,
                        updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                    },
                    {
                        content: 'Comment mock 2',
                        createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                        creator: {
                            id: 'id-mock-luan',
                            nickname: 'Luan',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-2',
                        likesCount: 0,
                        updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                    },
                    {
                        content: 'Comment mock 3',
                        createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                        creator: {
                            id: 'id-mock-amanda',
                            nickname: 'Amanda',
                        },
                        dislikesCount: 0,
                        id: 'id-mock-3',
                        likesCount: 0,
                        updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                    },
                ],
            },
            {
                id: 'id-mock-2',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                content: 'Post mock 2',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
            },
            {
                id: 'id-mock-3',
                creator: { id: 'id-mock-amanda', nickname: 'Amanda' },
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                content: 'Post mock 3',
                likesCount: 0,
                dislikesCount: 0,
                commentsCount: 0,
                comments: [],
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
