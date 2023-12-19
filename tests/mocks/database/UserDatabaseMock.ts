import { format } from 'date-fns';
import { USER_ROLES, UserDB } from '../../../src/models/User';
import { BaseDatabase } from '../../../src/database/BaseDatabase';

const usersMock: UserDB[] = [
    {
        id: 'id-mock-luan',
        nickname: 'Luan',
        email: 'luan@gmail.com',
        password: 'hash-mock-luan', // senha = "Luan@123"
        role: USER_ROLES.NORMAL,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
    {
        id: 'id-mock-amanda',
        nickname: 'Amanda',
        email: 'amanda@gmail.com',
        password: 'hash-mock-amanda', // senha = "Amanda@123"
        role: USER_ROLES.ADMIN,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
    {
        id: 'id-mock-carlinhos',
        nickname: 'Carlinhos',
        email: 'carlinhos@gmail.com',
        password: 'hash-mock-carlinhos', // senha = "Carlinhos@123"
        role: USER_ROLES.NORMAL,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
    {
        id: 'id-mock-layla',
        nickname: 'Layla',
        email: 'layla@gmail.com',
        password: 'hash-mock-layla', // senha = "Layla@123"
        role: USER_ROLES.NORMAL,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
    {
        id: 'id-mock-bia',
        nickname: 'Bia',
        email: 'bia@gmail.com',
        password: 'hash-mock-bia', // senha = "Bia@123"
        role: USER_ROLES.ADMIN,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
    {
        id: 'id-mock-jorginho',
        nickname: 'Jorginho',
        email: 'jorginho@gmail.com',
        password: 'hash-mock-jorginho', // senha = "Jorginho@123"
        role: USER_ROLES.NORMAL,
        created_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
        updated_at: format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
    },
];

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = 'users';

    public async findUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            return usersMock.filter((user) =>
                user.nickname
                    .toLocaleLowerCase()
                    .includes(q.toLocaleLowerCase())
            );
        } else {
            return usersMock;
        }
    }

    public async findAllUsers(): Promise<UserDB[]> {
        return usersMock;
    }

    public async findUserById(id: string): Promise<UserDB | undefined> {
        return usersMock.filter((user) => user.id === id)[0];
    }

    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        return usersMock.filter((user) => user.email === email)[0];
    }

    public async findUserByNickname(
        nickname: string
    ): Promise<string[] | undefined> {
        const user = usersMock.find((user) => user.nickname === nickname);
        return user ? [user.nickname] : undefined;
    }

    public async insertUser(newUserDB: UserDB): Promise<void> {}

    public async updateUserById(id: string, content: UserDB): Promise<void> {}

    public async deleteUserById(id: string): Promise<void> {}
}
