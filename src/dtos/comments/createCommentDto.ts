import z from 'zod';

export interface CreateCommentInputDTO {
    token: string;
    postId: string;
    content: string;
}

export interface CreateCommentOutputDTO {
    message: string;
    content: string;
}

export const CreateCommentSchema = z
    .object({
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
        postId: z
            .string({
                required_error: "'postId' é obrigatório",
                invalid_type_error: "'postId' deve ser do tipo string",
            })
            .min(1),
        content: z
            .string({
                required_error: "'content' é obrigatório",
                invalid_type_error: "'content' deve ser do tipo string",
            })
            .min(1),
    })
    .transform((data) => data as CreateCommentInputDTO);
