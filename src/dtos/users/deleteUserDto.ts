import z from 'zod';
import messages from '../../messages/messages.json';

export interface DeleteUserInputDTO {
    idToDelete: string;
    token: string;
}

export interface DeleteUserOutputDTO {
    message: string;
}

export const DeleteUserSchema = z
    .object({
        idToDelete: z.string({
            required_error: messages.idToDelete_required,
            invalid_type_error: messages.idToDelete_type_error,
        }),
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
    })
    .transform((data) => data as DeleteUserInputDTO);
