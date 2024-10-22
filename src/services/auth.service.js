import _http, { APIURL } from '../utils/http';

export async function login(email, password) {
  const data = {
    email,
    password,
  };
  const response = await _http.post(`${APIURL}user/auth/login`, data);

  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to login');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function signUp(user) {
  const response = await _http.post(`${APIURL}user/auth/register`, user);
  if (!response.status === 201) {
    const error = new Error('An error occurred while trying to login');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function sendPasswordResetEmail(email) {
  const data = {
    email,
  };
  const response = await _http.post(`${APIURL}user/auth/request-password-reset`, data);

  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to login');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}
export async function resetPassword(email, token, password) {
  const data = {
    email,
    token,
    password,
  };
  const response = await _http.post(`${APIURL}user/auth/reset-password`, data);

  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to login');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}
