import _http, { APIURL } from '../utils/http';

export async function getUsers(userEmail) {

    const response = await _http.get(`${APIURL}users?search=${userEmail}`);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}