const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = async (endpoint, options = {}) => {
  const { body, ...customConfig } = options;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    }

    throw new Error(data.message || 'Something went wrong');
  } catch (error) {
    return Promise.reject(error.message);
  }
};

export default api;
