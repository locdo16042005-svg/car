/**
 * Format a number as Vietnamese Dong (VND)
 * @param {number|string} value
 * @returns {string} e.g. "500,000,000 đ"
 */
export function formatCurrency(value) {
  if (value == null || value === '') return '0 đ';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0 đ';
  return num.toLocaleString('vi-VN') + ' đ';
}

export default formatCurrency;
