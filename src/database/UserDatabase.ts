import { UserDB } from '../models/User';
import { BaseDatabase } from './BaseDatabase';

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = 'users';

    // Estão sendo usados: ✅
    // Não estão sendo usados: ❌
    // Foi mockado: ✔

    // ✅ | ✔
    public async findUsers(q: string | undefined): Promise<UserDB[]> {
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

    // ❌ não usado em UserBusiness
    // ✅ | ✔ USADO EM CommentBusiness
    public async findAllUsers() {
        const usersDB: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        );

        return usersDB;
    }

    // ✅ | ✔
    public async findUserById(id: string): Promise<UserDB | undefined> {
        const [userDB]: UserDB[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ id });

        return userDB;
    }

    // ✅ | ✔
    public async findUserByEmail(email: string): Promise<UserDB | undefined> {
        const [userDB] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ email });

        return userDB;
    }

    // ✅ | ✔
    public async findUserByNickname(
        nickname: string
    ): Promise<string[] | undefined> {
        const result: { nickname: string }[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        )
            .select('nickname')
            .where({ nickname });

        if (result.length > 0) {
            const nicknames: string[] = result.map((user) => user.nickname);
            return nicknames;
        } else {
            return undefined;
        }
    }

    // ✅ | ✔
    public async insertUser(newUserDB: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(
            newUserDB
        );
    }

    // ✅ | ✔
    public async updateUserById(id: string, content: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .update(content);
    }

    // ✅ | ✔
    public async deleteUserById(id: string): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .del();
    }
}
