import z from 'zod';
import messages from '../../messages/messages.json';

export interface CreatePostInputDTO {
    token: string;
    content: string;
}

export interface CreatePostOutputDTO {
    message: string;
    content: string;
}

export const CreatePostSchema = z
    .object({
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        content: z
            .string({
                required_error: messages.content_required,
                invalid_type_error: messages.content_type_error,
            })
            .min(1, messages.content_min_length_invalid),
    })
    .transform((data) => data as CreatePostInputDTO);
