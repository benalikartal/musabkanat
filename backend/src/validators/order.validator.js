import { z } from 'zod';

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'İsim en az 2 karakter olmalıdır').max(100),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz').max(20),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().nullable().or(z.literal('')),
  address: z.string().min(5, 'Teslimat adresi en az 5 karakter olmalıdır').max(500),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'MEAL_CARD', 'ONLINE'], {
    errorMap: () => ({ message: 'Geçerli bir ödeme yöntemi seçiniz (CASH, CREDIT_CARD, MEAL_CARD, ONLINE)' })
  }),
  customerNote: z.string().max(500).optional().nullable(),
  items: z
    .array(
      z.object({
        menuItemId: z.string().min(1, 'Ürün ID zorunludur'),
        quantity: z.number().int().min(1, 'Miktar en az 1 olmalıdır').max(50, 'Tek seferde en fazla 50 adet sipariş verilebilir'),
        note: z.string().max(200).optional().nullable()
      })
    )
    .min(1, 'Sipariş için en az 1 ürün eklemelisiniz')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PREPARING',
    'READY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED'
  ], {
    errorMap: () => ({ message: 'Geçerli bir sipariş durumu giriniz' })
  })
});
