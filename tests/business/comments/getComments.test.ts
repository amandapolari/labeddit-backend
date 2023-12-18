import format from 'date-fns/format';
import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import { GetCommentSchema } from '../../../src/dtos/comments/getCommentDto';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing getComments business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock()
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
                content: 'Comment mock 1',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-2',
                creator: { id: 'id-mock-luan', nickname: 'Luan' },
                content: 'Comment mock 2',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                likesCount: 0,
                dislikesCount: 0,
            },
            {
                id: 'id-mock-3',
                creator: { id: 'id-mock-amanda', nickname: 'Amanda' },
                content: 'Comment mock 3',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
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
