import z from 'zod';

export interface UpdateUserInputDTO {
    idToEdit: string;
    token: string;
    nickname: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

export interface UpdateUserOutputDTO {
    message: string;
    user: {
        nickname: string;
        email: string;
        updatedAt: string;
    };
}

export const UpdateUserSchema = z
    .object({
        idToEdit: z
            .string({
                required_error: "'idToEdit' é obrigatório",
                invalid_type_error: "'idToEdit' deve ser do tipo string",
            })
            .uuid("'idToEdit' inválido"),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1, "'token' deve possuir no mínimo 1 caracteres"),
        nickname: z
            .string({
                invalid_type_error: "'nickname' deve ser do tipo string",
            })
            .min(2, "'nickname' deve possuir no mínimo 2 caracteres")
            .optional(),
        email: z
            .string({
                invalid_type_error: "'email' deve ser do tipo string",
            })
            .email("'email' inválido")
            .optional(),
        password: z
            .string({
                invalid_type_error: "'password' deve ser do tipo string",
            })
            .min(4, "'password' deve possuir no mínimo 4 caracteres")
            .optional(),
    })
    .transform((data) => data as UpdateUserInputDTO);
