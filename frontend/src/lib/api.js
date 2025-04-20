// Utility function to get the API base URL based on environment
export const getApiBaseUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000' 
    : process.env.NEXT_PUBLIC_API_URL;
};

export const getLLMApiUrl = () => {
  return process.env.NODE_ENV === 'development' 
    ? 'http://localhost:11434' 
    : process.env.NEXT_PUBLIC_API_URL;
};