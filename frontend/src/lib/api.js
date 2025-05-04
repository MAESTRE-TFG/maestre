// Utility function to get the API base URL based on environment
export const getApiBaseUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : 'https://maestre.tech';
};

export const getLLMApiUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:11434' 
    : null;
};
