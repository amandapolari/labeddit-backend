import z from 'zod';

export interface DeleteCommentInputDTO {
    token: string;
    commentId: string;
}

export interface DeleteCommentOutputDTO {
    message: string;
}

export const DeleteCommentSchema = z
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
    })
    .transform((data) => data as DeleteCommentInputDTO);
