import z from 'zod';
import { GetPost } from '../../models/Post';
import messages from '../../messages/messages.json';

export interface GetPostByIdInputDTO {
    idPost: string;
    token: string;
}

export type GetPostByIdOutputDTO = GetPost;

export const GetPostByIdSchema = z
    .object({
        idPost: z.string({
            invalid_type_error: messages.query_type_error,
            required_error: messages.idPost_required,
        }),
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
    })
    .transform((data) => data as GetPostByIdInputDTO);
