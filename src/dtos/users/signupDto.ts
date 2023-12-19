import z from 'zod';
import messages from '../../messages/messages.json';

export interface SignupInputDTO {
    nickname: string;
    email: string;
    password: string;
}

export interface SignupOutputDTO {
    message: string;
    token: string;
}

export const SignupSchema = z
    .object({
        nickname: z
            .string({
                required_error: messages.nickname_required,
                invalid_type_error: messages.nickname_type_error,
            })
            .min(2, messages.nickname_min_length_invalid)
            .max(20, messages.nickname_max_length_invalid),
        email: z
            .string({
                required_error: messages.email_required,
                invalid_type_error: messages.email_type_error,
            })
            .email(messages.email_invalid),
        password: z
            .string({
                required_error: messages.password_required,
                invalid_type_error: messages.password_type_error,
            })
            .min(4, messages.password_min_length_invalid)
            .max(20, messages.password_max_length_invalid),
    })
    .transform((data) => data as SignupInputDTO);
