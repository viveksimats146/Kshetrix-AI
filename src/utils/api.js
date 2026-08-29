export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Route to local backend if running in local browser or native Android WebView wrapper
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === 'appassets.androidplatform.net') {
      return 'http://localhost:8001';
    }
  }
  return 'https://kshetrix-ai.onrender.com';
};
