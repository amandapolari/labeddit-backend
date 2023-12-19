import z from 'zod';
import messages from '../../messages/messages.json';

export interface UpdateUserInputDTO {
    idToEdit: string;
    token: string;
    nickname: string | undefined;
    email: string | undefined;
    password: string | undefined;
}

export interface UpdateUserOutputDTO {
    message: string;
    user: {
        nickname: string;
        email: string;
        updatedAt: string;
    };
}

export const UpdateUserSchema = z
    .object({
        idToEdit: z.string({
            required_error: messages.idToEdit_required,
            invalid_type_error: messages.idToEdit_type_error,
        }),
        token: z.string({
            required_error: messages.token_required,
            invalid_type_error: messages.token_type_error,
        }),
        nickname: z
            .string({
                invalid_type_error: messages.nickname_type_error,
            })
            .min(2, messages.nickname_min_length_invalid)
            .max(20, messages.nickname_max_length_invalid)
            .optional(),
        email: z
            .string({
                invalid_type_error: messages.email_type_error,
            })
            .email(messages.email_invalid)
            .optional(),
        password: z
            .string({
                invalid_type_error: messages.password_type_error,
            })
            .min(4, messages.password_min_length_invalid)
            .max(20, messages.password_max_length_invalid)
            .optional(),
    })
    .transform((data) => data as UpdateUserInputDTO);
