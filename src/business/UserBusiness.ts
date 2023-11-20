import { format } from 'date-fns';
import { UserDatabase } from '../database/UserDatabase';
import { TokenPayload, USER_ROLES, User, UserDB } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { SignupInputDTO, SignupOutputDTO } from '../dtos/users/signupDto';
import { LoginInputDTO, LoginOutputDTO } from '../dtos/users/loginDto';
import { NotFoundError } from '../errors/NotFoundError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { HashManager } from '../services/HashManager';
import { GetUsersInputDTO } from '../dtos/users/getUsersDto';

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    // GET
    public getUsers = async (input: GetUsersInputDTO) => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const users = usersDB.map((user: UserDB) => {
            return new User(
                user.id,
                user.nickname,
                user.email,
                user.password,
                user.role,
                user.created_at,
                user.updated_at
            );
        });

        const output = users;

        return output;
    };

    // SIGNUP
    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { nickname, email, password } = input;

        const id = this.idGenerator.generate();

        const userDBExists = await this.userDatabase.findUserById(id);

        if (userDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        const hashPassword = await this.hashManager.hash(password);

        const user = new User(
            id,
            nickname,
            email,
            hashPassword,
            USER_ROLES.NORMAL,
            // Somente para teste:
            // USER_ROLES.ADMIN,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newUser: UserDB = {
            id: user.getId(),
            nickname: user.getNickname(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
            updated_at: user.getUpdatedAt(),
        };

        await this.userDatabase.insertUser(newUser);

        const payload: TokenPayload = {
            id: user.getId(),
            nickname: user.getNickname(),
            role: user.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: SignupOutputDTO = {
            message: 'Usuário cadastrado com sucesso',
            token,
        };

        return output;
    };

    // LOGIN
    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input;

        const userDB = await this.userDatabase.findUserByEmail(email);

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado");
        }

        const hashedPassword = userDB.password;

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            hashedPassword
        );

        if (!isPasswordCorrect) {
            throw new BadRequestError("'email' ou 'password' incorretos");
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at,
            userDB.updated_at
        );

        const payload: TokenPayload = {
            id: user.getId(),
            nickname: user.getNickname(),
            role: user.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: LoginOutputDTO = {
            message: 'Login realizado com sucesso',
            token: token,
        };

        return output;
    };

    // UPDATE => AINDA NÃO TEM ARQUITETURA APLICADA
    public updateUser = async (input: any) => {
        const { id, token, newNickname, newEmail, newPassword } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const userDB: UserDB[] = await this.userDatabase.findAllUsers();

        const mapUser = new Map();

        userDB.forEach((user) => {
            mapUser.set(user.id, user);
        });

        const userToEdit = mapUser.get(id);

        if (payload.role !== 'ADMIN') {
            if (userToEdit.id !== payload.id) {
                throw new BadRequestError(
                    'Você não tem permissão para editar este usuário'
                );
            }
        }

        const userDBExists = await this.userDatabase.findUserById(id);

        if (!userDBExists) {
            throw new BadRequestError("'id' não encontrado");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.nickname,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at,
            userDBExists.updated_at
        );

        if (newNickname !== undefined) {
            if (typeof newNickname !== 'string') {
                throw new BadRequestError("'newNickname' deve ser string");
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== 'string') {
                throw new BadRequestError("'newEmail' deve ser string");
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== 'string') {
                throw new BadRequestError("'newPassword' deve ser string");
            }
        }

        newNickname && user.setNickname(newNickname);
        newEmail && user.setEmail(newEmail);
        newPassword && user.setPassword(newPassword);

        const newUser: UserDB = {
            id: user.getId(),
            nickname: user.getNickname(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
            updated_at: user.getUpdatedAt(),
        };

        // console.log(newUser);

        await this.userDatabase.updateUserById(id, newUser);

        const output = {
            message: 'Usuário atualizado com sucesso',
            user: user,
        };

        return output;
    };

    // DELETE => AINDA NÃO TEM ARQUITETURA APLICADA
    public deleteUser = async (input: any) => {
        const { id, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        const userDB: UserDB[] = await this.userDatabase.findAllUsers();

        const mapUser = new Map();

        userDB.forEach((user) => {
            mapUser.set(user.id, user);
        });

        const userToDelete = mapUser.get(id);

        if (payload.role !== 'ADMIN') {
            if (userToDelete.id !== payload.id) {
                throw new BadRequestError(
                    'Você não tem permissão para deletar este usuário'
                );
            }
        }

        const userDBExists = await this.userDatabase.findUserById(id);

        if (!userDBExists) {
            throw new BadRequestError("'id' não existe");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.nickname,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at,
            userDBExists.updated_at
        );

        await this.userDatabase.deleteUserById(id);

        const output = {
            message: 'Usuário deletado com sucesso',
        };

        return output;
    };
}
