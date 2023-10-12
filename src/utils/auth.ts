/**
 * 从localStorage获取token
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * 往localStorage存储token
 */
const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

/**
 * 清空localStorage中的token
 */
const clearToken = () => {
  localStorage.removeItem('token');
};

export { getToken, setToken, clearToken };
