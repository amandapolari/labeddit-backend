import z from 'zod';
import messages from '../../messages/messages.json';

export interface DeletePostInputDTO {
    idToDelete: string;
    token: string;
}

export interface DeletePostOutputDTO {
    message: string;
}

export const DeletePostSchema = z
    .object({
        idToDelete: z
            .string({
                required_error: messages.idToDelete_required,
                invalid_type_error: messages.idToDelete_type_error,
            })
            .min(1),
        token: z
            .string({
                required_error: messages.token_required,
                invalid_type_error: messages.token_type_error,
            })
            .min(1),
    })
    .transform((data) => data as DeletePostInputDTO);
