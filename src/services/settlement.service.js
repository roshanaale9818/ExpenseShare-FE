import _http, { APIURL } from '../utils/http';

export async function getGroupList({ page, limit }) {
  const response = await _http.get(`${APIURL}settlement/group?page=${page}&limit=${limit}`);
  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function getAccepetedExpense({ page, limit, groupId }) {
  const response = await _http.get(
    `${APIURL}settlement/preview/expense?page=${page}&limit=${limit}&groupId=${groupId}`
  );
  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function GetSettlement({ page, limit }) {
  const response = await _http.get(`${APIURL}settlement?page=${page}&limit=${limit}`);
  if (response.status !== 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function getExpenseTotalByUsers({ page, limit, groupId }) {
  const response = await _http.get(
    `${APIURL}settlement/users/expense?page=${page}&limit=${limit}&groupId=${groupId}`
  );
  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function createSettlement(body) {
  const response = await _http.post(`${APIURL}settlement/create?groupId=${body.groupId}`, body);
  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}

export async function checkIfGroupHasUnSettledExpense(body) {
  const response = await _http.post(`${APIURL}settlement/create?groupId=${body.groupId}`, body);
  if (!response.status === 200) {
    const error = new Error('An error occurred while trying to create');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.data;
  return resData;
}
