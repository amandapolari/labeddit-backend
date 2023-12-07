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
import { GetUsersInputDTO, GetUsersOutputDTO } from '../dtos/users/getUsersDto';
import {
    UpdateUserInputDTO,
    UpdateUserOutputDTO,
} from '../dtos/users/updateUserDto';
import {
    DeleteUserInputDTO,
    DeleteUserOutputDTO,
} from '../dtos/users/deleteUserDto';
import messages from '../messages/messages.json';

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    // GET
    public getUsers = async (
        input: GetUsersInputDTO
    ): Promise<GetUsersOutputDTO> => {
        const { q, token } = input;
        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        } else if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError(messages.not_authorized);
        }

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const output: GetUsersOutputDTO = usersDB.map((userDB) => {
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

        return output;
    };

    // SIGNUP
    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { nickname, email, password } = input;

        const nicknameDBExists = await this.userDatabase.findUserByNickname(
            nickname
        );

        if (nicknameDBExists) {
            throw new BadRequestError(messages.nickname_not_available);
        }

        const emailDBExists = await this.userDatabase.findUserByEmail(email);

        if (emailDBExists) {
            throw new BadRequestError(messages.email_not_available);
        }

        const id = this.idGenerator.generate();

        const userDBExists = await this.userDatabase.findUserById(id);

        if (userDBExists) {
            throw new BadRequestError(messages.id_already_exists);
        }

        const hashPassword = await this.hashManager.hash(password);

        const newUser = new User(
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

        const newUserDB = newUser.toDBModel();
        await this.userDatabase.insertUser(newUserDB);

        const payload: TokenPayload = {
            id: newUser.getId(),
            nickname: newUser.getNickname(),
            role: newUser.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: SignupOutputDTO = {
            message: messages.user_registration_success,
            token,
        };

        return output;
    };

    // LOGIN
    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input;

        const userDB = await this.userDatabase.findUserByEmail(email);

        if (!userDB) {
            throw new NotFoundError(messages.email_not_available);
        }

        const hashedPassword = userDB.password;

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            hashedPassword
        );

        if (!isPasswordCorrect) {
            throw new BadRequestError(messages.incorrect_credentials);
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
            message: messages.user_login_success,
            token: token,
        };

        return output;
    };

    // UPDATE
    public updateUser = async (
        input: UpdateUserInputDTO
    ): Promise<UpdateUserOutputDTO> => {
        const { idToEdit, token, nickname, email, password } = input;

        let hashPassword;

        if (password) {
            hashPassword = await this.hashManager.hash(password);
        }

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (idToEdit !== payload.id) {
                throw new BadRequestError(messages.not_authorized);
            }
        }

        const userDBExists = await this.userDatabase.findUserById(idToEdit);

        if (!userDBExists) {
            throw new BadRequestError(messages.id_user_not_found);
        }

        if (nickname) {
            const userDBNicknameExists =
                await this.userDatabase.findUserByNickname(nickname);

            if (userDBNicknameExists) {
                throw new BadRequestError(messages.nickname_not_available);
            }
        }

        if (email) {
            const userDBEmailExists = await this.userDatabase.findUserByEmail(
                email
            );

            if (userDBEmailExists) {
                throw new BadRequestError(messages.email_not_available);
            }
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

        nickname && user.setNickname(nickname);

        email && user.setEmail(email);

        password && user.setPassword(hashPassword as string);

        user.setUpdatedAt(format(new Date(), 'dd-MM-yyyy HH:mm:ss'));

        const newUser: UserDB = {
            id: user.getId(),
            nickname: user.getNickname(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getCreatedAt(),
            updated_at: user.getUpdatedAt(),
        };

        await this.userDatabase.updateUserById(idToEdit, newUser);

        const output: UpdateUserOutputDTO = {
            message: messages.user_update_sucess,
            user: {
                nickname: user.getNickname(),
                email: user.getEmail(),
                updatedAt: user.getUpdatedAt(),
            },
        };

        return output;
    };

    // DELETE
    public deleteUser = async (
        input: DeleteUserInputDTO
    ): Promise<DeleteUserOutputDTO> => {
        const { idToDelete, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(messages.invalid_token);
        }

        const userDBExists = await this.userDatabase.findUserById(idToDelete);

        if (!userDBExists) {
            throw new BadRequestError(messages.id_post_not_found);
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (idToDelete !== payload.id) {
                throw new BadRequestError(messages.not_authorized);
            }
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

        await this.userDatabase.deleteUserById(user.getId());

        const output = {
            message: messages.user_delete_sucess,
        };

        return output;
    };
}
