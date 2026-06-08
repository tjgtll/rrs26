import { z } from 'zod';

function isValidEmail(email: string): boolean {
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (local.length === 0) return false;
  if (!domain.includes('.')) return false;
  return true;
}

export const formSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .regex(/^[A-Z]/, 'First letter must be uppercase'),
    age: z
      .number()
      .min(0, 'Age cannot be negative')
      .max(120, 'Age must be realistic'),
    email: z
      .string()
      .refine(isValidEmail, 'Invalid email format (e.g., name@domain.com)'),
    gender: z.enum(['male', 'female', 'other']),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the Terms and Conditions',
    }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Please select a country'),
    imageBase64: z.string().min(1, 'Image is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type FormSchema = z.infer<typeof formSchema>;
