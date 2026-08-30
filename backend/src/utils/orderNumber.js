import crypto from 'crypto';

/**
 * Generate readable and unique order numbers like MK-260830-8472
 */
export function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomInt(1000, 9999);
  return `MK-${dateStr}-${randomSuffix}`;
}
