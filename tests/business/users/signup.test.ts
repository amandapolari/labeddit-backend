import { UserBusiness } from '../../../src/business/UserBusiness';
import { SignupOutputDTO, SignupSchema } from '../../../src/dtos/users/signupDto';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { HashManagerMock } from '../../mocks/services/HashManagerMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { ZodError } from 'zod';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing signup business', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso e o token ao se cadastrar com sucesso', async () => {
        const input = SignupSchema.parse({
            nickname: 'Nickname',
            email: 'nickname@gmail.com',
            password: 'Nickname@123',
        });
        const returned: SignupOutputDTO = await userBusiness.signup(input);
        const expected: SignupOutputDTO = {
            message: messages.user_registration_success,
            token: 'token-mock',
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar erro se o nickname não possuir pelo menos 2 caracteres', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: '',
                email: 'ciclana@email.com',
                password: 'ciclana321',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(
                    messages.nickname_min_length_invalid
                );
            }
        }
    });

    test('deve disparar erro se o nickname possuir mais de 20 caracteres', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: 'aaaaaaaaaaaaaaaaaaaaa',
                email: 'ciclana@email.com',
                password: 'ciclana321',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(
                    messages.nickname_max_length_invalid
                );
            }
        }
    });

    test('deve disparar um erro caso o email esteja vazio', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: 'Nickname',
                email: '',
                password: 'Nickname@123',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(messages.email_invalid);
            }
        }
    });

    test('deve retornar um erro caso o nickname fornecido já esteja sendo utilizado', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: 'Amanda',
                email: 'amandinha@gmail.com',
                password: 'Amandinha@123',
            });
            await userBusiness.signup(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.nickname_not_available);
            }
        }
    });

    test('deve retornar um erro caso o email fornecido já esteja sendo utilizado', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: 'Julinha',
                email: 'amanda@gmail.com',
                password: 'Julinha@123',
            });
            await userBusiness.signup(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.email_not_available);
            }
        }
    });

    test('deve retornar um erro caso o id fornecido já esteja sendo utilizado', async () => {
        expect.assertions(1);

        try {
            const input = SignupSchema.parse({
                nickname: 'Julinha',
                email: 'amanda@gmail.com',
                password: 'Julinha@123',
            });
            await userBusiness.signup(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.email_not_available);
            }
        }
    });
});
