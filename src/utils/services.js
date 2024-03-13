import _http, { APIURL } from "./http";

export async function login(email, password) {
    const data = {
        email,
        password
    }
    const response = await _http.post(`${APIURL}user/auth/login`, data);

    if (!response.ok) {
        const error = new Error('An error occurred while creating the event');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const { resData } = await response.json();
    console.log("RESDATA",resData)

    return resData;

}