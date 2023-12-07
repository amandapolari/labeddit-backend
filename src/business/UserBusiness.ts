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
import {
    UpdateUserInputDTO,
    UpdateUserOutputDTO,
} from '../dtos/users/updateUserDto';
import { DeleteUserInputDTO } from '../dtos/users/deleteUserDto';

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

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.nickname,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at,
                userDB.updated_at
            );
            return user.toBusinessModel();
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

        const newUser = new User(
            id,
            nickname,
            email,
            hashPassword,
            // USER_ROLES.NORMAL,
            // Somente para teste:
            USER_ROLES.ADMIN,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newUserDB = newUser.toDBModel();
        await this.userDatabase.insertUser(newUserDB);

        const payload: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname(),
            role: newUser.getRole() as USER_ROLES,
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

    // UPDATE
    public updateUser = async (input: UpdateUserInputDTO) => {
        // capturando os dados do input:
        const { idToEdit, token, nickname, email, password } = input;

        // hashando a senha:
        let hashPassword;

        if (password) {
            hashPassword = await this.hashManager.hash(password);
        }

        // capturando o token:
        const payload = this.tokenManager.getPayload(token);

        // verificando se o usuário digitou um token:
        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        // verificando se o id do usuário que está logado é o mesmo que o id que ele quer editar:
        if (payload.role !== 'ADMIN') {
            if (idToEdit !== payload.id) {
                throw new BadRequestError(
                    'Você não tem permissão para editar este usuário'
                );
            }
        }

        // verificando se o id que o usuário quer editar existe:
        const userDBExists = await this.userDatabase.findUserById(idToEdit);

        if (!userDBExists) {
            throw new BadRequestError("'id' não encontrado");
        }

        // verificando se o nickname que o usuário quer editar já existe:
        if (nickname) {
            const userDBNicknameExists =
                await this.userDatabase.findUserByNickname(nickname);

            if (userDBNicknameExists) {
                throw new BadRequestError("'nickname' já existe");
            }
        }

        // verificando se o email que o usuário quer editar já existe:

        if (email) {
            const userDBEmailExists = await this.userDatabase.findUserByEmail(
                email
            );

            if (userDBEmailExists) {
                throw new BadRequestError("'email' já existe");
            }
        }

        // criando o usuário:
        const user = new User(
            userDBExists.id,
            userDBExists.nickname,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at,
            userDBExists.updated_at
        );

        // atualizando o nickname:
        nickname && user.setNickname(nickname);

        // atualizando o email:
        email && user.setEmail(email);

        // atualizando a senha:
        password && user.setPassword(hashPassword as string);

        // atualizando a data de atualização:
        user.setUpdatedAt(format(new Date(), 'dd-MM-yyyy HH:mm:ss'));

        // criando o objeto newUser:
        const newUser: UserDB = {
            id: user.getId(),
            nickname: user.getNickname(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getCreatedAt(),
            updated_at: user.getUpdatedAt(),
        };

        // atualizando o usuário no banco de dados:
        await this.userDatabase.updateUserById(idToEdit, newUser);

        // criando o output:
        const output: UpdateUserOutputDTO = {
            message: 'Usuário atualizado com sucesso',
            user: {
                nickname: user.getNickname(),
                email: user.getEmail(),
                updatedAt: user.getUpdatedAt(),
            },
        };

        return output;
    };

    // DELETE
    public deleteUser = async (input: DeleteUserInputDTO) => {
        // capturando os dados do input:
        const { idToDelete, token } = input;

        // capturando o token:
        const payload = this.tokenManager.getPayload(token);

        // verificando se o usuário digitou um token:
        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        // verificando se o id que o usuário quer deletar existe:
        const userDBExists = await this.userDatabase.findUserById(idToDelete);

        if (!userDBExists) {
            throw new BadRequestError("'id' não encontrado");
        }

        // verificando se o id do usuário que está logado é o mesmo que o id que ele quer deletar:
        if (payload.role !== 'ADMIN') {
            if (idToDelete !== payload.id) {
                throw new BadRequestError(
                    'Você não tem permissão para deletar este usuário'
                );
            }
        }

        // criando o usuário:
        const user = new User(
            userDBExists.id,
            userDBExists.nickname,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at,
            userDBExists.updated_at
        );

        // deletando o usuário no banco de dados:
        await this.userDatabase.deleteUserById(idToDelete);

        // criando o output:
        const output = {
            message: 'Usuário deletado com sucesso',
        };

        return output;
    };
}
