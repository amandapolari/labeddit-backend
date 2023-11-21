import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { BaseError } from '../errors/BaseError';
import { SignupSchema } from '../dtos/users/signupDto';
import { ZodError } from 'zod';
import { LoginSchema } from '../dtos/users/loginDto';

export class UserController {
    constructor(private userBusiness: UserBusiness) {}

    // GET
    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q as string | undefined,
                token: req.headers.authorization as string,
            };

            const output = await this.userBusiness.getUsers(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // SIGNUP
    public signup = async (req: Request, res: Response) => {
        try {
            const input = SignupSchema.parse({
                nickname: req.body.nickname as string,
                email: req.body.email as string,
                password: req.body.password as string,
            });

            const output = await this.userBusiness.signup(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // LOGIN
    public login = async (req: Request, res: Response) => {
        try {
            const input = LoginSchema.parse({
                email: req.body.email,
                password: req.body.password,
            });

            const output = await this.userBusiness.login(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // UPDATE => AINDA NÃO TEM ARQUITETURA APLICADA
    public updateUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                token: req.headers.authorization as string,
                newNickname: req.body.nickname as string,
                newEmail: req.body.email as string,
                newPassword: req.body.password as string,
            };

            const output = await this.userBusiness.updateUser(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // DELETE => AINDA NÃO TEM ARQUITETURA APLICADA
    public deleteUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                token: req.headers.authorization as string,
            };

            const output = await this.userBusiness.deleteUser(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}
