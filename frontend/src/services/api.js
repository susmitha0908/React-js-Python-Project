import axios from 'axios';

// Set up base URL from environment or fallback to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCommands = async (filters = {}) => {
  const response = await api.get('/commands', { params: filters });
  return response.data;
};

export const getCommandById = async (id) => {
  const response = await api.get(`/commands/${id}`);
  return response.data;
};

export const getCommandsByCategory = async (category) => {
  const response = await api.get(`/commands/category/${category}`);
  return response.data;
};

export const createCommand = async (commandData) => {
  const response = await api.post('/commands', commandData);
  return response.data;
};

export const deleteCommand = async (id) => {
  const response = await api.delete(`/commands/${id}`);
  return response.data;
};

export const toggleFavorite = async (id) => {
  const response = await api.post(`/favorites/${id}`);
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/favorites');
  return response.data;
};

export default api;
