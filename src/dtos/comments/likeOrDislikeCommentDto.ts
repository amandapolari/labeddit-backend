import z from 'zod';

export interface LikeOrDislikeCommentInputDTO {
    idComment: string;
    token: string;
    like: boolean;
}

export type LikeOrDislikeCommentOutputDTO = {
    message: string;
};

export const LikeOrDislikeCommentSchema = z
    .object({
        idComment: z
            .string({
                required_error: "'idComment' é obrigatória",
                invalid_type_error: "'idComment' deve ser do tipo string",
            })
            .min(1, "'idComment' deve possuir no mínimo 1 caractere"),
        token: z
            .string({
                required_error: "'token' é obrigatória",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1, "'token' deve possuir no mínimo 1 caractere"),
        like: z.boolean(),
    })
    .transform((data) => data as LikeOrDislikeCommentInputDTO);
