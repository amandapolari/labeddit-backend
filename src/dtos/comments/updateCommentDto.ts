import z from 'zod';

export interface UpdateCommentInputDTO {
    token: string;
    commentId: string;
    content: string;
}

export interface UpdateCommentOutputDTO {
    message: string;
    content: string;
}

export const UpdateCommentSchema = z
    .object({
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
        commentId: z
            .string({
                required_error: "'commentId' é obrigatório",
                invalid_type_error: "'commentId' deve ser do tipo string",
            })
            .min(1),
        content: z
            .string({
                required_error: "'content' é obrigatório",
                invalid_type_error: "'content' deve ser do tipo string",
            })
            .min(1),
    })
    .transform((data) => data as UpdateCommentInputDTO);
