import z from 'zod';

export interface UpdatePostInputDTO {
    idToEdit: string;
    token: string;
    content: string;
}

export interface UpdatePostOutputDTO {
    message: string;
    content: string;
}

export const UpdatePostSchema = z
    .object({
        idToEdit: z
            .string({
                required_error: "'idToEdit' é obrigatório",
                invalid_type_error: "'idToEdit' deve ser do tipo string",
            })
            .min(1),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
        content: z
            .string({
                required_error: "'content' é obrigatório",
                invalid_type_error: "'content' deve ser do tipo string",
            })
            .min(1),
    })
    .transform((data) => data as UpdatePostInputDTO);
