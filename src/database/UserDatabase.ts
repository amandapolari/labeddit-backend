import { UserDB } from '../models/User';
import { BaseDatabase } from './BaseDatabase';

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = 'users';

    public async findUsers(q: string | undefined) {
        let usersDB;

        if (q) {
            const result: UserDB[] = await BaseDatabase.connection(
                UserDatabase.TABLE_USERS
            )
                .where('nickname', 'LIKE', `%${q}%`)
                .orderBy('nickname', 'ASC');
            usersDB = result;
        } else {
            const result: UserDB[] = await BaseDatabase.connection(
                UserDatabase.TABLE_USERS
            ).orderBy('nickname', 'ASC');
            usersDB = result;
        }

        return usersDB;
    }

    public async findAllUsers() {
        const usersDB: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        );

        return usersDB;
    }

    public async findUserById(id: string): Promise<UserDB> {
        const [userDB]: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ id });

        return userDB;
    }

    public async findUserByEmail(email: string) {
        const [userDB] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ email });

        return userDB;
    }

    public async findNicknameById(id: string): Promise<string> {
        const [nicknameDB]: string[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        )
            .select('nickname')
            .where({ id });

        return nicknameDB;
    }

    public async insertUser(newUserDB: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(
            newUserDB
        );
    }

    public async updateUserById(id: string, content: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .update(content);
    }

    public async deleteUserById(id: string): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .del();
    }
}
