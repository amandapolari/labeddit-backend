import { format } from 'date-fns';
import { UserBusiness } from '../../../src/business/UserBusiness';
import { UpdateUserSchema } from '../../../src/dtos/users/updateUserDto';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { HashManagerMock } from '../../mocks/services/HashManagerMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { ZodError } from 'zod';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing updateUser business', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso e um objeto mostrando as atualizações (nickname)', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'token-mock-luan',
            nickname: 'Luanzinho',
            // email: 'luan@gmail.com',
            // password: 'Luan@123',
        });
        const returned = await userBusiness.updateUser(input);

        const expected = {
            message: messages.user_update_sucess,
            user: {
                nickname: 'Luanzinho',
                email: 'luan@gmail.com',
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        };

        expect(returned).toEqual(expected);
    });

    test('deve retornar uma mensagem de sucesso e um objeto mostrando as atualizações (email)', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'token-mock-luan',
            // nickname: 'Luanzinho',
            email: 'luanzinho@gmail.com',
            // password: 'Luan@123',
        });
        const returned = await userBusiness.updateUser(input);

        const expected = {
            message: messages.user_update_sucess,
            user: {
                nickname: 'Luan',
                email: 'luanzinho@gmail.com',
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        };

        expect(returned).toEqual(expected);
    });

    test('deve retornar uma mensagem de sucesso e um objeto mostrando as atualizações (password)', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'token-mock-luan',
            // nickname: 'Luanzinho',
            // email: 'luanzinho@gmail.com',
            password: 'Luanzinho@123',
        });
        const returned = await userBusiness.updateUser(input);

        const expected = {
            message: messages.user_update_sucess,
            user: {
                nickname: 'Luan',
                email: 'luan@gmail.com',
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar um erro caso o token esteja vazio', async () => {
        expect.assertions(1);

        try {
            const input = UpdateUserSchema.parse({
                idToEdit: 'id-mock-luan',
                token: undefined,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(messages.token_required);
            }
        }
    });

    test('deve disparar um erro 400 caso receba um token inválido', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'abcd',
        });

        expect.assertions(2);

        try {
            await userBusiness.updateUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário não seja admin e queira atualizar uma conta que não é dele', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-amanda',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await userBusiness.updateUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
    test('deve disparar um erro 400 caso o usuário tenha fornecido um id que não consta no banco de dados', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-lua',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await userBusiness.updateUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.id_user_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });
    test('deve disparar um erro 400 caso o usuário tente criar um nickname que já exista no banco de dados', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'token-mock-luan',
            nickname: 'Amanda',
        });

        expect.assertions(2);

        try {
            await userBusiness.updateUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.nickname_not_available);
                expect(error.statusCode).toBe(400);
            }
        }
    });
    test('deve disparar um erro 400 caso o usuário tente criar um email que já exista no banco de dados', async () => {
        const input = UpdateUserSchema.parse({
            idToEdit: 'id-mock-luan',
            token: 'token-mock-luan',
            email: 'amanda@gmail.com',
        });

        expect.assertions(2);

        try {
            await userBusiness.updateUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.email_not_available);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
