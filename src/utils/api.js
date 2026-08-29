export const getApiBaseUrl = () => {
  // During local development, route to localhost:8001
  if (import.meta.env.DEV) {
    return 'http://localhost:8001';
  }
  // Otherwise, default to the whitelisted production backend URL
  return 'https://kshetrix-ai.onrender.com';
};
