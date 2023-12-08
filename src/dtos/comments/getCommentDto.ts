import z from 'zod';
import { GetComment } from '../../models/Comment';

export interface GetCommentInputDTO {
    token: string;
    q: string | undefined;
}

export type GetCommentOutputDTO = GetComment[];

export const GetCommentSchema = z
    .object({
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
        q: z
            .string({
                invalid_type_error: "'q' deve ser do tipo string",
            })
            .min(1)
            .optional(),
    })
    .transform((data) => data as GetCommentInputDTO);
