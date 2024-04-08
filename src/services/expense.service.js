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