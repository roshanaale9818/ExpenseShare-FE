import _http, { APIURL } from '../utils/http';

export async function addExpense(expense) {
    const data = {
        ...expense
    }
    const response = await _http.post(`${APIURL}expense/add?groupId=${expense.group}`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}


export async function editExpense(expense) {
    const data = {
        ...expense
    }
    const response = await _http.post(`${APIURL}expense/update?groupId=${expense.group}`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}



export async function getExpenseList({page,limit}) {
    const response = await _http.get(`${APIURL}expense/list?page=${page}&limit=${limit}`,);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}

export async function getGroupExpense({page,limit,groupId}) {
    const response = await _http.get(`${APIURL}group/expense?groupId=${groupId}&page=${page}&limit=${limit}`,);
    if (!response.status === 200) {
        const error = new Error('An error occurred');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}
export async function deleteExpense(id) {
    const data = {
        expenseId:id
    }
    const response = await _http.post(`${APIURL}expense/delete`, data);


    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }
    const resData = await response.data;
    return resData;
}

// all the expense request
export async function getExpenseRequest({page,limit}) {
    const response = await _http.get(`${APIURL}expense/request?page=${page}&limit=${limit}`,);
    if (!response.status === 200) {
        const error = new Error('An error occurred while trying to create');
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const resData = await response.data;
    return resData;

}
