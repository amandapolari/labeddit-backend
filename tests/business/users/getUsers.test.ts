import { format } from 'date-fns';
import { UserBusiness } from '../../../src/business/UserBusiness';
import {
    GetUsersOutputDTO,
    GetUsersSchema,
} from '../../../src/dtos/users/getUsersDto';
import { UserDatabaseMock } from '../../mocks/database/UserDatabaseMock';
import { HashManagerMock } from '../../mocks/services/HashManagerMock';
import { IdGeneratorMock } from '../../mocks/services/IdGeneratorMock';
import { TokenManagerMock } from '../../mocks/services/TokenManagerMock';
import { ZodError } from 'zod';
import messages from '../../../src/messages/messages.json';
import { BadRequestError } from '../../../src/errors/BadRequestError';

describe('testing getUsers business', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    );

    // cases of success:
    test('deve retornar uma lista de usuários ao buscar todos os usuários', async () => {
        const input = GetUsersSchema.parse({
            token: 'token-mock-amanda',
        });

        const returned = await userBusiness.getUsers(input);

        const expected: GetUsersOutputDTO = [
            {
                id: 'id-mock-luan',
                nickname: 'Luan',
                email: 'luan@gmail.com',
                password: 'hash-mock-luan', // senha = "Luan@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-amanda',
                nickname: 'Amanda',
                email: 'amanda@gmail.com',
                password: 'hash-mock-amanda', // senha = "Amanda@123"
                role: 'ADMIN',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-carlinhos',
                nickname: 'Carlinhos',
                email: 'carlinhos@gmail.com',
                password: 'hash-mock-carlinhos', // senha = "Carlinhos@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-layla',
                nickname: 'Layla',
                email: 'layla@gmail.com',
                password: 'hash-mock-layla', // senha = "Layla@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-bia',
                nickname: 'Bia',
                email: 'bia@gmail.com',
                password: 'hash-mock-bia', // senha = "Bia@123"
                role: 'ADMIN',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-jorginho',
                nickname: 'Jorginho',
                email: 'jorginho@gmail.com',
                password: 'hash-mock-jorginho', // senha = "Jorginho@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        ];

        expect(returned).toEqual(expected);
    });

    test('deve retornar uma lista de usuários que possuem "Luan" em seu nickname', async () => {
        const input = GetUsersSchema.parse({
            q: 'Luan',
            token: 'token-mock-amanda',
        });

        const returned = await userBusiness.getUsers(input);

        const expected: GetUsersOutputDTO = [
            {
                id: 'id-mock-luan',
                nickname: 'Luan',
                email: 'luan@gmail.com',
                password: 'hash-mock-luan',
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        ];

        expect(returned).toEqual(expected);
    });

    test('deve retornar uma lista de usuários que possuem "L" em seu nickname', async () => {
        const input = GetUsersSchema.parse({
            q: 'L',
            token: 'token-mock-amanda',
        });

        const expected: GetUsersOutputDTO = [
            {
                id: 'id-mock-luan',
                nickname: 'Luan',
                email: 'luan@gmail.com',
                password: 'hash-mock-luan',
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-carlinhos',
                nickname: 'Carlinhos',
                email: 'carlinhos@gmail.com',
                password: 'hash-mock-carlinhos', // senha = "Carlinhos@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
            {
                id: 'id-mock-layla',
                nickname: 'Layla',
                email: 'layla@gmail.com',
                password: 'hash-mock-layla', // senha = "Layla@123"
                role: 'NORMAL',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        ];

        const returned = await userBusiness.getUsers(input);

        expect(returned).toEqual(expected);
    });
    test('deve retornar uma lista de usuários que possuem "Am" em seu nickname', async () => {
        const input = GetUsersSchema.parse({
            q: 'Am',
            token: 'token-mock-amanda',
        });

        const returned = await userBusiness.getUsers(input);

        const expected: GetUsersOutputDTO = [
            {
                id: 'id-mock-amanda',
                nickname: 'Amanda',
                email: 'amanda@gmail.com',
                password: 'hash-mock-amanda',
                role: 'ADMIN',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        ];

        expect(returned).toEqual(expected);
    });
    test('deve retornar uma lista de usuários que possuem "AmAndA" em seu nickname sendo case insensitive', async () => {
        const input = GetUsersSchema.parse({
            q: 'AmAndA',
            token: 'token-mock-amanda',
        });

        const returned = await userBusiness.getUsers(input);

        const expected: GetUsersOutputDTO = [
            {
                id: 'id-mock-amanda',
                nickname: 'Amanda',
                email: 'amanda@gmail.com',
                password: 'hash-mock-amanda',
                role: 'ADMIN',
                createdAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
                updatedAt: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            },
        ];

        expect(returned).toEqual(expected);
    });

    // cases of failure:

    test('deve disparar um erro caso o token esteja vazio', async () => {
        expect.assertions(1);

        try {
            const input = GetUsersSchema.parse({
                token: undefined,
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(messages.token_required);
            }
        }
    });

    test('deve disparar um erro caso o token receba uma string vazia', async () => {
        expect.assertions(1);

        try {
            const input = GetUsersSchema.parse({
                token: '',
            });
        } catch (error) {
            if (error instanceof ZodError) {
                expect(error.issues[0].message).toBe(
                    messages.token_min_length_invalid
                );
            }
        }
    });

    test('deve disparar um erro 400 caso receba um token inválido', async () => {
        const input = GetUsersSchema.parse({
            token: 'abcd',
        });

        expect.assertions(2);

        try {
            await userBusiness.getUsers(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.invalid_token);
                expect(error.statusCode).toBe(400);
            }
        }
    });

    test('deve disparar um erro 400 caso receba o token não seja ADMIN', async () => {
        const input = GetUsersSchema.parse({
            token: 'token-mock-luan',
        });

        expect.assertions(2);

        try {
            await userBusiness.getUsers(input);
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.message).toBe(messages.not_authorized);
                expect(error.statusCode).toBe(400);
            }
        }
    });
});
