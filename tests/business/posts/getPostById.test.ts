import { PostBusiness } from '../../../src/business/PostBusiness';
import { GetPostByIdSchema } from '../../../src/dtos/posts/getPostByIdDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing getPostById business', () => {
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
    test('deve retornar um post ao buscar por id', async () => {
        const input = GetPostByIdSchema.parse({
            idPost: 'id-mock-1',
            token: 'token-mock-amanda',
        });

        const returned = await postBusiness.getPostById(input);

        const expected = {
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
                    isCurrentUserComment: false,
                    userLikedBoolean: null,
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
                    isCurrentUserComment: false,
                    userLikedBoolean: null,
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
                    isCurrentUserComment: true,
                    userLikedBoolean: null,
                },
            ],
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve retornar um erro quando o post não existe', async () => {
        expect.assertions(2);

        const input = GetPostByIdSchema.parse({
            idPost: 'abcd',
            token: 'token-mock-amanda',
        });

        try {
            await postBusiness.getPostById(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.id_post_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
