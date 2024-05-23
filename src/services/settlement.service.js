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
