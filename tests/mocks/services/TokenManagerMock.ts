import { TokenPayload, USER_ROLES } from '../../../src/models/User';

export class TokenManagerMock {
    public createToken = (payload: TokenPayload): string => {
        if (payload.id === 'id-mock') {
            // signup de nova conta
            return 'token-mock';
        } else if (payload.id === 'id-mock-luan') {
            // login de luan (conta normal)
            return 'token-mock-luan';
        } else {
            // login de amanda (conta admin)
            return 'token-mock-amanda';
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
        } else {
            return null;
        }
    };
}
