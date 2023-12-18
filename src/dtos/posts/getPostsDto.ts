import z from 'zod';
import { GetPost } from '../../models/Post';
import messages from '../../messages/messages.json';

export interface GetPostsInputDTO {
    q: string | undefined;
    token: string;
}

export type GetPostsOutputDTO = GetPost[];

export const GetPostsSchema = z
    .object({
        q: z
            .string({
                invalid_type_error: messages.query_type_error,
            })
            .optional(),
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
    })
    .transform((data) => data as GetPostsInputDTO);
