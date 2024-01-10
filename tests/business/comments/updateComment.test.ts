import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { UpdateCommentSchema } from '../../../src/dtos/comments/updateCommentDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';

describe('testing updateComment business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock(),
        new PostDatabaseMock()
    );

    // cases of success
    test('deve retornar uma mensagem de sucesso ao atualizar um comentário', async () => {
        const input = UpdateCommentSchema.parse({
            token: 'token-mock-amanda',
            idComment: 'id-mock-3',
            content: 'Comment mock',
        });

        const returned = await commentBusiness.updateComment(input);

        const expected = {
            message: messages.comment_updated_sucess,
            content: 'Comment mock',
        };

        expect(returned).toEqual(expected);
    });

    // cases of error
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        try {
            const input = UpdateCommentSchema.parse({
                token: 'abc',
                idComment: 'id-mock-3',
                content: 'Comment mock',
            });
            await commentBusiness.updateComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar erro se o id for inválido', async () => {
        const input = UpdateCommentSchema.parse({
            token: 'token-mock-amanda',
            idComment: 'id-mock-x',
            content: 'Comment mock',
        });

        expect.assertions(2);

        try {
            await commentBusiness.updateComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.comment_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });
    test('deve disparar erro tentar editar um comentário que não seja de seu autoria', async () => {
        const input = UpdateCommentSchema.parse({
            token: 'token-mock-luan',
            idComment: 'id-mock-3',
            content: 'Comment mock',
        });

        expect.assertions(2);

        try {
            await commentBusiness.updateComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
