import z from 'zod';

export interface CreatePostInputDTO {
    token: string;
    content: string;
}

export interface CreatePostOutputDTO {
    message: string;
    content: string;
}

export const CreatePostSchema = z
    .object({
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
    .transform((data) => data as CreatePostInputDTO);
