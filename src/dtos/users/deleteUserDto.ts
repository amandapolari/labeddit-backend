import z from 'zod';

export interface DeleteUserInputDTO {
    idToDelete: string;
    token: string;
}

export interface DeleteUserOutputDTO {
    message: string;
}

export const DeleteUserSchema = z
    .object({
        idToDelete: z
            .string({
                required_error: "'idToDelete' é obrigatório",
                invalid_type_error: "'idToDelete' deve ser do tipo string",
            })
            .uuid("'idToDelete' inválido"),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1, "'token' deve possuir no mínimo 1 caracteres"),
    })
    .transform((data) => data as DeleteUserInputDTO);
