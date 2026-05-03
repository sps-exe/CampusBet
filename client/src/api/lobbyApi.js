import api from './axiosInstance';

/** GET /lobbies — list with optional filters */
export const getLobbies = (params = {}) =>
  api.get('/lobbies', { params }).then((r) => r.data);

/** GET /lobbies/:id */
export const getLobbyById = (id) =>
  api.get(`/lobbies/${id}`).then((r) => r.data);

/** POST /lobbies — create a new lobby */
export const createLobby = (data) =>
  api.post('/lobbies', data).then((r) => r.data);

/** POST /lobbies/:id/join — join a lobby as player */
export const joinLobby = (id) =>
  api.post(`/lobbies/${id}/join`).then((r) => r.data);

/** POST /lobbies/:id/leave — leave a lobby */
export const leaveLobby = (id) =>
  api.post(`/lobbies/${id}/leave`).then((r) => r.data);

/** POST /lobbies/:id/spectate — place a spectator bid */
export const spectatorBid = (id, data) =>
  api.post(`/lobbies/${id}/spectate`, data).then((r) => r.data);

/** PATCH /lobbies/:id/result — submit match result */
export const submitResult = (id, data) =>
  api.patch(`/lobbies/${id}/result`, data).then((r) => r.data);

/** POST /lobbies/:id/dispute — flag a dispute */
export const disputeMatch = (id, data) =>
  api.post(`/lobbies/${id}/dispute`, data).then((r) => r.data);

/** DELETE /lobbies/:id — cancel a lobby (host only) */
export const cancelLobby = (id) =>
  api.delete(`/lobbies/${id}`).then((r) => r.data);
