import _http, { APIURL } from '../utils/http';

export async function addGroup(groupName) {
    const data = {
        groupName
    }
    const response = await _http.post(`${APIURL}group/create`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}