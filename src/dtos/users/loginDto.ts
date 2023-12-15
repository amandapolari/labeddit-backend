import z from 'zod';
import messages from '../../messages/messages.json';

export interface LoginInputDTO {
    email: string;
    password: string;
}

export interface LoginOutputDTO {
    message: string;
    token: string;
}

export const LoginSchema = z
    .object({
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
    .transform((data) => data as LoginInputDTO);
