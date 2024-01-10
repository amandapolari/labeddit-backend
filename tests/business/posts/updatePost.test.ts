import { PostBusiness } from '../../../src/business/PostBusiness';
import { UpdatePostSchema } from '../../../src/dtos/posts/updatePostDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing updatePost business', () => {
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
    test('deve retornar uma mensagem de sucesso ao atualizar um post', async () => {
        const input = UpdatePostSchema.parse({
            idToEdit: 'id-mock-1',
            token: 'token-mock-luan',
            content: 'Post mock',
        });

        const returned = await postBusiness.updatePost(input);

        const expected = {
            message: messages.post_updated_sucess,
            content: 'Post mock',
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        const input = UpdatePostSchema.parse({
            idToEdit: 'id-mock-1',
            token: 'abc',
            content: 'Post mock',
        });

        try {
            await postBusiness.updatePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar erro se o id for inválido', async () => {
        expect.assertions(2);

        const input = UpdatePostSchema.parse({
            idToEdit: 'id-mock-abc',
            token: 'token-mock-luan',
            content: 'Post mock',
        });

        try {
            await postBusiness.updatePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.id_post_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar erro se o usuário quiser editar o post de outra pessoa', async () => {
        expect.assertions(2);

        const input = UpdatePostSchema.parse({
            idToEdit: 'id-mock-3',
            token: 'token-mock-luan',
            content: 'Post mock',
        });

        try {
            await postBusiness.updatePost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
