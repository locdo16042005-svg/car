/**
 * Validate Vietnamese phone number: 10 digits, starts with 0
 */
export function validatePhone(phone) {
  if (!phone) return { valid: false, message: 'Số điện thoại không được để trống' };
  const regex = /^0\d{9}$/;
  if (!regex.test(phone)) {
    return { valid: false, message: 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate password: min 8 chars, at least 1 uppercase, at least 1 digit
 */
export function validatePassword(password) {
  if (!password) return { valid: false, message: 'Mật khẩu không được để trống' };
  if (password.length < 8) {
    return { valid: false, message: 'Mật khẩu phải có ít nhất 8 ký tự' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Mật khẩu phải có ít nhất 1 chữ hoa' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Mật khẩu phải có ít nhất 1 chữ số' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate email format
 */
export function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email không được để trống' };
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return { valid: false, message: 'Email không hợp lệ' };
  }
  return { valid: true, message: '' };
}
