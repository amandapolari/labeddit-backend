import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { CreateCommentSchema } from '../../../src/dtos/comments/createCommentDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing createComment business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock()
    );

    // cases of success
    test('deve retornar uma mensagem de sucesso ao criar um comentário', async () => {
        const input = CreateCommentSchema.parse({
            token: 'token-mock-amanda',
            idPost: 'id-mock-1',
            content: 'Comment mock',
        });

        const returned = await commentBusiness.createComment(input);

        const expected = {
            message: messages.comment_created_sucess,
            content: 'Comment mock',
        };

        expect(returned).toEqual(expected);
    });

    // cases of error
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        try {
            const input = CreateCommentSchema.parse({
                token: 'abc',
                idPost: 'id-mock-1',
                content: 'Comment mock',
            });
            await commentBusiness.createComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
