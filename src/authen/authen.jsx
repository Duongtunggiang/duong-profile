/**
 * File quản lý cấu hình user và authentication state
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

/**
 * Lưu token vào localStorage
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Lấy token từ localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Xóa token khỏi localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Lưu thông tin user vào localStorage
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Lấy thông tin user từ localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Đăng xuất - xóa tất cả thông tin
 */
export const logout = () => {
  removeToken();
};
