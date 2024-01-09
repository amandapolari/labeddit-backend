import { CommentBusiness } from '../../../src/business/CommentBusiness';
import { LikeOrDislikeCommentSchema } from '../../../src/dtos/comments/likeOrDislikeCommentDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';

describe('testing likeOrDislikeComment business', () => {
    const commentBusiness = new CommentBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new CommentDatabaseMock(),
        new UserDatabaseMock(),
        new PostDatabaseMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso ao dar like em um comentário', async () => {
        const input = LikeOrDislikeCommentSchema.parse({
            idComment: 'id-mock-3',
            token: 'token-mock-luan',
            like: true,
        });

        const returned = await commentBusiness.likeOrDislikeComment(input);

        const expected = {
            message: messages.like_created_sucess,
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    // test('deve disparar um erro 400 caso o id seja inválido', async () => {
    //     const input = LikeOrDislikeCommentSchema.parse({
    //         idComment: 'id',
    //         token: 'token-mock-luan',
    //         like: true,
    //     });

    //     expect.assertions(2);

    //     try {
    //         await commentBusiness.likeOrDislikeComment(input);
    //     } catch (error) {
    //         if (error instanceof BadRequestError) {
    //             expect(error.message).toBe(messages.invalid_token);
    //             expect(error.statusCode).toBe(400);
    //         }
    //     }
    // });

    test('deve disparar um erro 404 caso o usuário tenha fornecido um id que não consta no banco de dados', async () => {
        const input = LikeOrDislikeCommentSchema.parse({
            idComment: 'id-mock-unexistent',
            token: 'token-mock-luan',
            like: true,
        });

        expect.assertions(2);

        try {
            await commentBusiness.likeOrDislikeComment(input);
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe(messages.comment_not_found);
                expect(error.statusCode).toBe(404);
            }
        }
    });

    test('deve disparar um erro se tentar dar like no próprio post', async () => {
        const input = LikeOrDislikeCommentSchema.parse({
            idComment: 'id-mock-1',
            token: 'token-mock-luan',
            like: true,
        });

        expect.assertions(2);

        try {
            await commentBusiness.likeOrDislikeComment(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.like_not_allowed);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    /*
    ATÉ AQUI:
    80.34% statements
    100% functions
    80% lines
    */
});
