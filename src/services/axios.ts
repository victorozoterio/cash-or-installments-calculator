import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/calculator`,
  headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
});
