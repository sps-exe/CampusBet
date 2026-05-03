import api from './axiosInstance';

/** GET /tournaments */
export const getTournaments = (params = {}) =>
  api.get('/tournaments', { params }).then((r) => r.data);

/** GET /tournaments/:id */
export const getTournamentById = (id) =>
  api.get(`/tournaments/${id}`).then((r) => r.data);

/** POST /tournaments — create */
export const createTournament = (data) =>
  api.post('/tournaments', data).then((r) => r.data);

/** PATCH /tournaments/:id — update */
export const updateTournament = (id, data) =>
  api.patch(`/tournaments/${id}`, data).then((r) => r.data);

/** DELETE /tournaments/:id — cancel */
export const cancelTournament = (id) =>
  api.delete(`/tournaments/${id}`).then((r) => r.data);

/** POST /tournaments/:id/register */
export const registerForTournament = (id) =>
  api.post(`/tournaments/${id}/register`).then((r) => r.data);

/** POST /tournaments/:id/withdraw */
export const withdrawFromTournament = (id) =>
  api.post(`/tournaments/${id}/withdraw`).then((r) => r.data);

/** POST /tournaments/:id/start — generate bracket */
export const startTournament = (id) =>
  api.post(`/tournaments/${id}/start`).then((r) => r.data);
