import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .email('auth.invalidEmail')
    .min(1, 'auth.requiredFields'),
  password: z.string()
    .min(1, 'auth.requiredFields')
    .min(6, 'auth.passwordTooShort')
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export function validateLoginCredentials(data: unknown) {
  return loginSchema.safeParse(data);
}