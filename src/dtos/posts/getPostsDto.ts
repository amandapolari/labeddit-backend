import z from 'zod';
import { GetPost, PostModel } from '../../models/Post';

export interface GetPostsInputDTO {
    q: string | undefined;
    token: string;
}

export type GetPostsOutputDTO = GetPost[];

export const GetPostsSchema = z
    .object({
        q: z
            .string({
                invalid_type_error: "'q' deve ser do tipo string",
            })
            .optional(),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1),
    })
    .transform((data) => data as GetPostsInputDTO);
