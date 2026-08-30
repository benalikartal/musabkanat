import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(100, 'İsim çok uzun'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').max(150),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz').max(20),
  password: z
    .string()
    .min(6, 'Şifre en az 6 karakter olmalıdır')
    .max(100, 'Şifre çok uzun')
});

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(1, 'Şifre girilmelidir')
});
