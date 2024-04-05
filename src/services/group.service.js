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


export async function getAllGroups({page,limit}) {
    const response = await _http.get(`${APIURL}group/list?page=${page}&limit=${limit}`,);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}

export async function getMembers(groupId) {
    const response = await _http.get(`${APIURL}group/members?groupId=${groupId}`);
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


export async function getGroupDetail(groupId) {
    const response = await _http.get(`${APIURL}group/getgroup?groupId=${groupId}`);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}


export async function addGroupMember(uEmail, groupId) {
    const body ={
        userEmail:uEmail,
        groupId
    }
    const response = await _http.post(`${APIURL}group/member/add?groupId=${groupId}`,body);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}




export async function removeGroupMember(userId, groupId,memberId) {
    const body ={
        userId,
        groupId,
        memberId
    }
    const response = await _http.post(`${APIURL}group/member/remove?groupId=${groupId}`,body);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}
