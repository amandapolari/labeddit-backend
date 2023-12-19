import z from 'zod';
import messages from '../../messages/messages.json';

export interface UpdateCommentInputDTO {
    token: string;
    idComment: string;
    content: string;
}

export interface UpdateCommentOutputDTO {
    message: string;
    content: string;
}

export const UpdateCommentSchema = z
    .object({
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        idComment: z.string({
            required_error: messages.idComment_required,
            invalid_type_error: messages.idComment_type_error,
        }),
        content: z
            .string({
                required_error: messages.content_required,
                invalid_type_error: messages.content_type_error,
            })
            .min(1, messages.content_min_length_invalid),
    })
    .transform((data) => data as UpdateCommentInputDTO);
