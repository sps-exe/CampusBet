import api from './axiosInstance';

/** POST /auth/signup */
export const signup = (data) => api.post('/auth/signup', data).then((r) => r.data);

/** POST /auth/login */
export const login = (data) => api.post('/auth/login', data).then((r) => r.data);

/** POST /auth/logout */
export const logout = () => api.post('/auth/logout').then((r) => r.data);

/** GET /auth/me — returns current user */
export const getMe = () => api.get('/auth/me').then((r) => r.data);

/** POST /auth/refresh — refresh access token */
export const refreshToken = () => api.post('/auth/refresh').then((r) => r.data);
