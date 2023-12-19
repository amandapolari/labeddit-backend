import z from 'zod';
import { GetComment } from '../../models/Comment';
import messages from '../../messages/messages.json';

export interface GetCommentInputDTO {
    token: string;
    q: string | undefined;
}

export type GetCommentOutputDTO = GetComment[];

export const GetCommentSchema = z
    .object({
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        q: z
            .string({
                invalid_type_error: messages.query_type_error,
            })
            .optional(),
    })
    .transform((data) => data as GetCommentInputDTO);
