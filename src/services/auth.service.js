import _http, { APIURL } from '../utils/http';

export async function login(email, password) {
    const data = {
        email,
        password
    }
    const response = await _http.post(`${APIURL}user/auth/login`, data);
  

    if (!response.status===200) {
        const error = new Error('An error occurred while trying to login');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const  resData  = await response.data;
    return resData;

}

export async function signUp(user) {
    const response = await _http.post(`${APIURL}user/auth/register`, user);
    if (!response.status===201) {
        const error = new Error('An error occurred while trying to login');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const  resData  = await response.data;
    return resData;
}