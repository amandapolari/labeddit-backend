import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { DeleteCommentSchema } from '../../../src/dtos/comments/deleteCommentDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { UpdateCommentSchema } from '../../../src/dtos/comments/updateCommentDto';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';

describe('testing deleteComment business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock(),
        new PostDatabaseMock()
    );

    // cases of success
    test('deve retornar uma mensagem de sucesso ao deletar um comentário', async () => {
        const input = DeleteCommentSchema.parse({
            token: 'token-mock-amanda',
            idComment: 'id-mock-3',
        });

        const returned = await commentBusiness.deleteComment(input);

        const expected = {
            message: messages.comment_deleted_sucess,
        };

        expect(returned).toEqual(expected);
    });

    // cases of error
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        try {
            const input = DeleteCommentSchema.parse({
                token: 'abc',
                idComment: 'id-mock-3',
            });
            await commentBusiness.deleteComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar erro se o comentário não existir', async () => {
        const input = DeleteCommentSchema.parse({
            token: 'token-mock-luan',
            idComment: 'id-mock-30',
        });

        expect.assertions(2);

        try {
            await commentBusiness.deleteComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.comment_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar erro se um usuário tentar deletar um comentário que não é seu', async () => {
        const input = DeleteCommentSchema.parse({
            token: 'token-mock-luan',
            idComment: 'id-mock-3',
        });

        expect.assertions(2);

        try {
            await commentBusiness.deleteComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
