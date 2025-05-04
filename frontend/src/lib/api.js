// Utility function to get the API base URL based on environment
export const getApiBaseUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : 'http://165.22.68.4';
};

export const getLLMApiUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:11434' 
    : 'http://localhost:11434';
};
