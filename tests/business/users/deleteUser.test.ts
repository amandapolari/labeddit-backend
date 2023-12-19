import { UserBusiness } from '../../../src/business/UserBusiness';
import { DeleteUserSchema } from '../../../src/dtos/users/deleteUserDto';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { HashManagerMock } from '../../mocks/services/HashManagerMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';
import { ZodError } from 'zod';

describe('testing deleteUser business', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    // cases of success:
    test('deve retornar uma mensagem de sucesso ao deletar um usuário', async () => {
        const input = DeleteUserSchema.parse({
            idToDelete: 'id-mock-luan',
            token: 'token-mock-luan',
        });

        const returned = await userBusiness.deleteUser(input);

        const expected = {
            message: messages.user_delete_sucess,
        };

        expect(returned).toEqual(expected);
    });

    // cases of failure:
    test('deve disparar um erro 400 caso o id seja inválido', async () => {
        const input = DeleteUserSchema.parse({
            idToDelete: 'id-mock-luan',
            token: 'abcd',
        });

        expect.assertions(2);

        try {
            await userBusiness.deleteUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro caso o token esteja vazio', async () => {
        expect.assertions(1);
        try {
            const input = DeleteUserSchema.parse({
                idToDelete: 'id-mock-luan',
                token: undefined,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(messages.token_required);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário tenha fornecido um id que não consta no banco de dados', async () => {
        const input = DeleteUserSchema.parse({
            idToDelete: 'id-mock-lua',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await userBusiness.deleteUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.id_user_not_found);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso o usuário não seja admin e queira atualizar uma conta que não é dele', async () => {
        const input = DeleteUserSchema.parse({
            idToDelete: 'id-mock-amanda',
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await userBusiness.deleteUser(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
