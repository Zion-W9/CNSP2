
export const isProduction = (): boolean => {
  return process.env.REACT_APP_ENV === "production";
};

export const getBackendUrl = (): string => {
  const devUrl = 'http://localhost:3001';
  const prodUrl = process.env.REACT_APP_BACKEND_URL ?? devUrl;

  return isProduction() ? prodUrl : devUrl;
};

export const fetchBackend = (path: string,  auth: boolean, options?: RequestInit, ): Promise<Response> => {
  let opts = options;
  if (auth) {
    opts = {
      ...options,
      headers: {
        ...options?.headers,
        'Authorization': `Basic ${localStorage.getItem('auth')}`
      }
    };
  }
  opts = {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...opts?.headers,
    }
  };
  return fetch(getBackendUrl() + path, opts);
}
