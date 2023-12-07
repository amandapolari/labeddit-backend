import z from 'zod';

export interface DeletePostInputDTO {
    idToDelete: string;
    token: string;
}

export interface DeletePostOutputDTO {
    message: string;
}

export const DeletePostSchema = z
    .object({
        idToDelete: z
            .string({
                required_error: "'idToDelete' é obrigatório",
                invalid_type_error: "'idToDelete' deve ser do tipo string",
            })
            .min(1),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
    })
    .transform((data) => data as DeletePostInputDTO);
