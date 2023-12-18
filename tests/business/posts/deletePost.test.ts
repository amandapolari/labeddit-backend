import { PostBusiness } from '../../../src/business/PostBusiness';
import { DeletePostSchema } from '../../../src/dtos/posts/deletePostDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing deletePost business', () => {
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
    test('deve retornar uma mensagem de sucesso ao deletar um post', async () => {
        const input = DeletePostSchema.parse({
            idToDelete: 'id-mock-1',
            token: 'token-mock-luan',
        });
        const returned = await postBusiness.deletePost(input);

        const expected = {
            message: messages.post_deleted_sucess,
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar um erro 400 caso o id seja inválido', async () => {
        const input = DeletePostSchema.parse({
            idToDelete: 'id-mock-luan',
            token: 'abcd',
        });

        expect.assertions(2);

        try {
            await postBusiness.deletePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário tenha fornecido um id que não consta no banco de dados', async () => {
        const input = DeletePostSchema.parse({
            idToDelete: 'id-mock-lua',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await postBusiness.deletePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.id_post_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário não seja admin e queira atualizar um post que não é dele', async () => {
        const input = DeletePostSchema.parse({
            idToDelete: 'id-mock-3',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await postBusiness.deletePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
