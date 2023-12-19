import z from 'zod';
import messages from '../../messages/messages.json';

export interface UpdatePostInputDTO {
    idToEdit: string;
    token: string;
    content: string;
}

export interface UpdatePostOutputDTO {
    message: string;
    content: string;
}

export const UpdatePostSchema = z
    .object({
        idToEdit: z
            .string({
                required_error: messages.idToEdit_required,
                invalid_type_error: messages.idToEdit_type_error,
            })
            .min(1),
        token: z
            .string({
                required_error: messages.token_required,
                invalid_type_error: messages.token_type_error,
            })
            .min(1),
        content: z
            .string({
                required_error: messages.content_required,
                invalid_type_error: messages.content_type_error,
            })
            .min(1),
    })
    .transform((data) => data as UpdatePostInputDTO);
