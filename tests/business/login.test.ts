import { UserBusiness } from '../../src/business/UserBusiness';
import { UserDatabaseMock } from '../mocks/database/UserDatabaseMock';
import { IdGeneratorMock } from '../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../mocks/services/TokenManagerMock';
import { HashManagerMock } from '../mocks/services/HashManagerMock';
import { LoginOutputDTO, LoginSchema } from '../../src/dtos/users/loginDto';
import messages from '../../src/messages/messages.json';
import { NotFoundError } from '../../src/errors/NotFoundError';
import { BadRequestError } from '../../src/errors/BadRequestError';
import { ZodError } from 'zod';

describe('testing login business', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    // cases of success:
    test('deve retornar uma mensagem e o token ao se logar com sucesso', async () => {
        const input = LoginSchema.parse({
            email: 'luan@gmail.com',
            password: 'Luan@123',
        });

        const returned = await userBusiness.login(input);

        const expected: LoginOutputDTO = {
            message: messages.user_login_success,
            token: 'token-mock-luan',
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:

    test('deve disparar um erro caso o email esteja vazio', async () => {
        expect.assertions(1);

        try {
            const input = LoginSchema.parse({
                email: '',
                password: 'Nickname@123',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(messages.email_invalid);
            }
        }
    });

    test('deve disparar um erro caso a senha esteja vazia', async () => {
        expect.assertions(1);

        try {
            const input = LoginSchema.parse({
                email: 'amanda@gmail.com',
                password: '',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(
                    messages.password_min_length_invalid
                );
            }
        }
    });

    test('deve retornar erro 404 quando o e-mail não está cadastrado', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'example@gmail.com',
                password: 'Example@123',
            });
            await userBusiness.login(input);
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404);
            }
        }
    });

    test('deve retornar mensagem de erro quando o e-mail não está cadastrado', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'example@gmail.com',
                password: 'Example@123',
            });
            await userBusiness.login(input);
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.message).toBe(messages.email_not_available);
            }
        }
    });

    test('deve retornar erro 400 quando a senha está incorreta', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'amanda@gmail.com',
                password: 'Amand@123',
            });
            await userBusiness.login(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
