import { TokenPayload, USER_ROLES } from '../../../src/models/User';

export class TokenManagerMock {
    public createToken = (payload: TokenPayload): string => {
        const { id } = payload;

        if (id === 'id-mock-luan') {
            // login de Luan (conta normal)
            return 'token-mock-luan';
        } else if (id === 'id-mock-amanda') {
            // login de Amanda (conta admin)
            return 'token-mock-amanda';
        } else if (id === 'id-mock-carlinhos') {
            // login de Carlinhos (conta normal)
            return 'token-mock-carlinhos';
        } else if (id === 'id-mock-layla') {
            // login de Layla (conta normal)
            return 'token-mock-layla';
        } else if (id === 'id-mock-bia') {
            // login de Bia (conta admin)
            return 'token-mock-bia';
        } else if (id === 'id-mock-jorginho') {
            // login de Jorginho (conta normal)
            return 'token-mock-jorginho';
        } else {
            // Se o ID não corresponder a nenhum usuário conhecido, retorna um token genérico
            return 'token-mock';
        }
    };

    public getPayload = (token: string): TokenPayload | null => {
        if (token === 'token-mock-luan') {
            return {
                id: 'id-mock-luan',
                nickname: 'Luan',
                role: USER_ROLES.NORMAL,
            };
        } else if (token === 'token-mock-amanda') {
            return {
                id: 'id-mock-amanda',
                nickname: 'Amanda',
                role: USER_ROLES.ADMIN,
            };
        } else if (token === 'token-mock-carlinhos') {
            return {
                id: 'id-mock-carlinhos',
                nickname: 'Carlinhos',
                role: USER_ROLES.NORMAL,
            };
        } else if (token === 'token-mock-layla') {
            return {
                id: 'id-mock-layla',
                nickname: 'Layla',
                role: USER_ROLES.NORMAL,
            };
        } else if (token === 'token-mock-bia') {
            return {
                id: 'id-mock-bia',
                nickname: 'Bia',
                role: USER_ROLES.ADMIN,
            };
        } else if (token === 'token-mock-jorginho') {
            return {
                id: 'id-mock-jorginho',
                nickname: 'Jorginho',
                role: USER_ROLES.NORMAL,
            };
        } else {
            return null;
        }
    };
}
