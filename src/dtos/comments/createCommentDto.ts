import z from 'zod';
import messages from '../../messages/messages.json';

export interface CreateCommentInputDTO {
    token: string;
    idPost: string;
    content: string;
}

export interface CreateCommentOutputDTO {
    message: string;
    content: string;
}

export const CreateCommentSchema = z
    .object({
        token: z
            .string({
                required_error: messages.token_required,
                invalid_type_error: messages.token_type_error,
            })
            .min(1),
        idPost: z
            .string({
                required_error: messages.idPost_required,
                invalid_type_error: messages.idPost_type_error,
            })
            .min(1),
        content: z
            .string({
                required_error: messages.content_required,
                invalid_type_error: messages.content_type_error,
            })
            .min(1, messages.content_min_length_invalid),
    })
    .transform((data) => data as CreateCommentInputDTO);
