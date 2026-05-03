import api from './axiosInstance';

/** GET /users/:id — public profile */
export const getUserById = (id) =>
  api.get(`/users/${id}`).then((r) => r.data);

/** PATCH /users/me — update own profile */
export const updateProfile = (data) =>
  api.patch('/users/me', data).then((r) => r.data);

/** GET /users/leaderboard */
export const getLeaderboard = (params = {}) =>
  api.get('/users/leaderboard', { params }).then((r) => r.data);

/** GET /users/me/match-history */
export const getMatchHistory = () =>
  api.get('/users/me/match-history').then((r) => r.data);

/** GET /users/me/wallet — credits + transaction log */
export const getWallet = () =>
  api.get('/users/me/wallet').then((r) => r.data);
