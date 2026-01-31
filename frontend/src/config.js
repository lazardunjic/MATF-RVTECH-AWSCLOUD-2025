export const API_BASE_URL = 'http://localhost:4566/restapis/dshslhzvuf/dev/_user_request_';

export const API_ENDPOINTS = {
  GET_CHARGERS: `${API_BASE_URL}/chargers`,
  GET_CHARGER_BY_ID: (id) => `${API_BASE_URL}/chargers/${id}`,
  SEARCH_CHARGERS: `${API_BASE_URL}/search`,
  SYNC_DATA: `${API_BASE_URL}/sync`
};