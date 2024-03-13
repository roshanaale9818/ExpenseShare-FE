import axios from 'axios';
// react query for caching 
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();
export const APIURL = "http://localhost:8081/api/v1/";


// axios instance
const _http = axios.create({
  baseURL: `${APIURL}`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    // Add your authorization token here
    'x-access-token': `${getToken()}`
  }
});


function getToken(){
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

export default _http;
export {getToken};





