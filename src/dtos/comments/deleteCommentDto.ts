import z from 'zod';
import messages from '../../messages/messages.json';

export interface DeleteCommentInputDTO {
    token: string;
    idComment: string;
}

export interface DeleteCommentOutputDTO {
    message: string;
}

export const DeleteCommentSchema = z
    .object({
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        idComment: z.string({
            required_error: messages.idComment_required,
            invalid_type_error: messages.idComment_type_error,
        }),
    })
    .transform((data) => data as DeleteCommentInputDTO);
