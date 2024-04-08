import axios from 'axios';
// react query for caching 
import { QueryClient } from "@tanstack/react-query";

const api = import.meta.env.VITE_API_URL;

export const queryClient = new QueryClient();
export const APIURL = api || "http://localhost:8081/api/v1/";


// axios instance
const _http = axios.create({
  baseURL: `${APIURL}`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    // Add your authorization token here
    'x-access-token': `${getToken()}`
  }
});



export function getToken(){
  try{
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    let token ='';
    if(!currentUser || !currentUser.accessToken){
      token = null;
    }
    else{
        token=currentUser.accessToken;
    }
    return token;
  }
  catch(err){
    console.log('err',err)
    return null;
  }
}

export function attachToken() {
  const token = getToken();
  if (token) {
      _http.defaults.headers['x-access-token'] = token;
      console.log("Token attached successfully.");
  } else {
      console.log("No token found. Please check your token");
  }
}


export function getUserId(){
  try{
    const currentUser = JSON.parse(sessionStorage.getItem("user"));
    let userId ='';
    if(!currentUser || !currentUser.id){
      userId = null;
    }
    else{
        userId=currentUser.id;
    }
    return userId;
  }
  catch(err){
    console.log('err',err)
    return null;
  }
}

export default _http;






