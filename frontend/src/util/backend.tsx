
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === "production";
};

export const getBackendUrl = (): string => {
  const prodUrl = 'https://securetodo-backend';
  const devUrl = 'http://localhost:8000';

  return isProduction() ? prodUrl : devUrl;
};

export const fetchBackend = (path: string, options?: RequestInit): Promise<Response> => fetch(getBackendUrl() + path, options);