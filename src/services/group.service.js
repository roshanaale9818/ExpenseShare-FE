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

export async function getGroupList({page,limit}) {
    const response = await _http.get(`${APIURL}group/getgrouplist?page=${page}&limit=${limit}`,);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}


export async function editGroup({groupName,groupId}) {
    const data = {
        groupName,
        groupId
    }
    const response = await _http.post(`${APIURL}group/update`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}

export async function deleteGroup(id) {
    const data = {
        groupId:id
    }
    const response = await _http.post(`${APIURL}group/delete`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}
