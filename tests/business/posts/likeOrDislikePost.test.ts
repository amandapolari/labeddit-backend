import { PostBusiness } from '../../../src/business/PostBusiness';
import { LikeOrDislikePostSchema } from '../../../src/dtos/posts/likeOrDislikePostDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { NotFoundError } from '../../../src/errors/NotFoundError';

describe('testing likeOrDislikePost business', () => {
    const postBusiness = new PostBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso ao dar like em um post', async () => {
        const input = LikeOrDislikePostSchema.parse({
            idPost: 'id-mock-3',
            token: 'token-mock-luan',
            like: true,
        });

        const returned = await postBusiness.likeOrDislikePost(input);

        const expected = {
            message: messages.like_created_sucess,
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar um erro 400 caso o id seja inválido', async () => {
        const input = LikeOrDislikePostSchema.parse({
            idPost: 'id-mock-3',
            token: 'abcd',
            like: true,
        });

        expect.assertions(2);

        try {
            await postBusiness.likeOrDislikePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 404 caso o usuário tenha fornecido um id que não consta no banco de dados', async () => {
        const input = LikeOrDislikePostSchema.parse({
            idPost: 'id-mock-unexistent',
            token: 'token-mock-luan',
            like: true,
        });

        expect.assertions(2);

        try {
            await postBusiness.likeOrDislikePost(input);
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe(messages.id_post_not_found);
                expect(error.statusCode).toBe(404);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário tenha tente dar like no seu próprio post', async () => {
        const input = LikeOrDislikePostSchema.parse({
            idPost: 'id-mock-1',
            token: 'token-mock-luan',
            like: true,
        });

        expect.assertions(2);

        try {
            await postBusiness.likeOrDislikePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.like_not_allowed);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário tenha tente dar dislike no seu próprio post', async () => {
        const input = LikeOrDislikePostSchema.parse({
            idPost: 'id-mock-1',
            token: 'token-mock-luan',
            like: false,
        });

        expect.assertions(2);

        try {
            await postBusiness.likeOrDislikePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.like_not_allowed);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    /*
    ATÉ AQUI ESTÁ EM: 
    82.4% Statements 14/17 
    100% Functions
    82.4% Lines
    */
});
