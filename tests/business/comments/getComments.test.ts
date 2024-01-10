import format from 'date-fns/format';
import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import { GetCommentSchema } from '../../../src/dtos/comments/getCommentDto';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';

describe('testing getComments business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock(),
        new PostDatabaseMock()
    );

    // cases of success
    test('deve retornar uma mensagem de sucesso ao buscar os comentários', async () => {
        const input = GetCommentSchema.parse({
            token: 'token-mock-amanda',
            q: undefined,
        });

        const returned = await commentBusiness.getComments(input);

        const expected = [
            {
                id: 'id-mock-1',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                postId: 'id-mock-1',
                content: 'Comentário do Luan no primeiro post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-2',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                postId: 'id-mock-1',
                content: 'Outro comentário do Luan no primeiro post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-3',
                creator: { id: 'id-mock-amanda', nickname: 'Amanda' },
                postId: 'id-mock-1',
                content: 'Comentário da Amanda no primeiro post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-4',
                creator: { id: 'id-mock-carlinhos', nickname: 'Carlinhos' },
                postId: 'id-mock-2',
                content: 'Comentário do Carlinhos no segundo post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-5',
                creator: { id: 'id-mock-layla', nickname: 'Layla' },
                postId: 'id-mock-2',
                content: 'Comentário da Layla no segundo post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-6',
                creator: { id: 'id-mock-bia', nickname: 'Bia' },
                postId: 'id-mock-3',
                content: 'Comentário da Bia no terceiro post',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm'),
                likesCount: 0,
                dislikesCount: 0,
            },
        ];

        expect(returned).toEqual(expected);
    });

    // cases of error
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        try {
            const input = GetCommentSchema.parse({
                token: 'abc',
                q: undefined,
            });
            await commentBusiness.getComments(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
