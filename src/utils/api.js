export const getApiBaseUrl = () => {
  // Use local Wi-Fi IP address directly to bypass ADB reverse tunnel resets
  return 'http://10.111.176.190:8001';
};
