export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return 'https://kshetrix-backend.onrender.com';
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:8001';
};
