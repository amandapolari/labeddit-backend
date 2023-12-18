import z from 'zod';
import messages from '../../messages/messages.json';

export interface LikeOrDislikePostInputDTO {
    idPost: string;
    token: string;
    like: boolean;
}

export type LikeOrDislikePostOutputDTO = {
    message: string;
};

export const LikeOrDislikePostSchema = z
    .object({
        idPost: z.string({
            required_error: messages.idPost_required,
            invalid_type_error: messages.idPost_type_error,
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
    .transform((data) => data as LikeOrDislikePostInputDTO);
