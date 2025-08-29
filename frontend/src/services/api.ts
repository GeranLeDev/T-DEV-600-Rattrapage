import axios from 'axios';
import { API_BASE_URL } from '../utils/constant';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter les clés API Trello à chaque requête
api.interceptors.request.use((config) => {
  const apiKey = '4737fbc2e8ceeeb0381eb834425436d1';
  const token = 'ATTA03731579eba3b2f3de26e32768bf61ee3085529116c03c60b7bd54f1f47350639ADDDF7D';

  if (!apiKey || !token) {
    throw new Error("Les clés API Trello sont manquantes dans les variables d'environnement");
  }

  // Ajouter les paramètres d'authentification à l'URL
  const separator = config.url?.includes('?') ? '&' : '?';
  config.url = `${config.url}${separator}key=${apiKey}&token=${token}`;

  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Gérer les erreurs de réponse (400, 401, 403, etc.)
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'Une erreur est survenue');
    }
    return Promise.reject(error);
  }
);

export { api };
