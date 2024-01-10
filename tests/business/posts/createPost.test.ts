import { PostBusiness } from '../../../src/business/PostBusiness';
import { CreatePostSchema } from '../../../src/dtos/posts/createPostDto';
import { CommentDatabaseMock } from '../../mocks/database/CommentDatabaseMock';
import { PostDatabaseMock } from '../../mocks/database/PostDatabaseMock';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing createPost business', () => {
    const postBusiness = new PostBusiness(
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new PostDatabaseMock(),
        new UserDatabaseMock(),
        new CommentDatabaseMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso ao criar um post', async () => {
        const input = CreatePostSchema.parse({
            token: 'token-mock-amanda',
            content: 'Post mock',
        });

        const returned = await postBusiness.createPost(input);

        const expected = {
            message: messages.post_created_sucess,
            content: 'Post mock',
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar erro se o token for inválido', async () => {
        expect.assertions(2);

        try {
            const input = CreatePostSchema.parse({
                token: 'abc',
                content: 'Post mock',
            });
            await postBusiness.createPost(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
