import { z } from 'zod';

export const updateSettingSchema = z.object({
  key: z.string().min(1, 'Ayar anahtarı zorunludur'),
  value: z.any()
});

export const batchUpdateSettingsSchema = z.record(z.string(), z.any());
