import z from 'zod';
import { UserModel } from '../../models/User';
import messages from '../../messages/messages.json';

export interface GetUsersInputDTO {
    q: string | undefined;
    token: string;
}

export type GetUsersOutputDTO = UserModel[];

export const GetUsersSchema = z
    .object({
        q: z
            .string({
                invalid_type_error: messages.query_type_error,
            })
            .optional(),
        token: z
            .string({
                required_error: messages.token_required,
                invalid_type_error: messages.token_type_error,
            })
            .min(1),
    })
    .transform((data) => data as GetUsersInputDTO);
