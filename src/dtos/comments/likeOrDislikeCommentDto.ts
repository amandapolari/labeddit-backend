import z from 'zod';
import messages from '../../messages/messages.json';

export interface LikeOrDislikeCommentInputDTO {
    idComment: string;
    token: string;
    like: boolean;
}

export type LikeOrDislikeCommentOutputDTO = {
    message: string;
};

export const LikeOrDislikeCommentSchema = z
    .object({
        idComment: z.string({
            required_error: messages.idComment_required,
            invalid_type_error: messages.idComment_type_error,
        }),
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        like: z.boolean({
            required_error: messages.like_required,
            invalid_type_error: messages.like_type_error,
        }),
    })
    .transform((data) => data as LikeOrDislikeCommentInputDTO);
