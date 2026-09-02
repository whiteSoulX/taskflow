import api from './api';

export async function login(username, password) {
  const { data } = await api.post('/auth/login/', { username, password });
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export async function register(username, email, password, password2) {
  const { data } = await api.post('/auth/register/', {
    username,
    email,
    password,
    password2,
  });
  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('access_token');
}

export async function getMe() {
  const { data } = await api.get('/auth/me/');
  return data;
}
