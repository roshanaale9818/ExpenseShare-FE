import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
// import { useAppContext } from 'src/providers/AppReducer';

// Define API URL and QueryClient for caching
const api = import.meta.env.VITE_API_URL;
export const queryClient = new QueryClient();
export const APIURL = api || 'http://localhost:8081/api/v1/';
let showSnackBar;
// Utility function to retrieve token from session storage
function getToken() {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    return currentUser?.accessToken || null;
  } catch (err) {
    console.error('Error retrieving token:', err);
    return null;
  }
}

// Utility function to get User ID
function getUserId() {
  try {
    const currentUser = JSON.parse(sessionStorage.getItem('user'));
    return currentUser?.id || null;
  } catch (err) {
    console.error('Error retrieving user ID:', err);
    return null;
  }
}

// Axios instance with base URL and default headers
const _http = axios.create({
  baseURL: `${APIURL}`,
  headers: {
    'Content-Type': 'application/json',
    'x-access-token': `${getToken()}`,
  },
});

// _http.interceptors.response.use(
//   (response) => {
//     console.log('Response logging', response);
//     return response;
//   },
//   (error) => {
//     console.log(error);
//     console.log('this is an error', error.response.status);

//     // Accessing the context
//     // const { setError } = useInterceptor(); // Get setError from context
//     // const { status } = error.response;
//     let errorMessage = 'An unexpected error occurred.';

//     switch (error.response.status) {
//       case 400:
//         errorMessage = 'Bad Request. Please check your input.';
//         // setError(true, errorMessage);
//         console.log(' I HAVE AN ERROR', errorMessage);
//         break;
//       case 401:
//         errorMessage = 'Unauthorized. Please log in again.';
//         break;
//       case 404:
//         errorMessage = 'Not Found. The requested resource could not be found.';
//         break;
//       case 500:
//         errorMessage = 'Internal Server Error. Please try again later.';
//         break;
//       default:
//         errorMessage = 'An error occurred. Please try again.';
//         break;
//     }
//     return Promise.reject(error);
//   }
// );

export function attachToken() {
  try {
    const token = getToken();
    if (token) {
      _http.defaults.headers['x-access-token'] = token;
      console.log('Token attached successfully.');
    } else {
      console.log('No token found. Please check your token');
      throw new Error('No token found. Please check your token');
    }
  } catch (error) {
    console.error('An error has occured.', error);
  }
}
export default _http;
export { getUserId, getToken };

// Axios Interceptor
export const setAxiosErrorHandler = (errorHandler) => {
  const ignoredEndpoints = ['/signin', '/login']; // Endpoints to be ignored

  // Request Interceptor
  _http.interceptors.request.use(
    (config) => {
      // Check if the request URL matches any ignored endpoint
      if (!ignoredEndpoints.some((endpoint) => config.url.includes(endpoint))) {
        // Perform any operations for non-ignored endpoints
        // Example: Show a loading indicator
        console.log('Request made to:', config.url);
      }
      return config; // Always return the config
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Response Interceptor
  _http.interceptors.response.use(
    (response) => {
      // Check if the request URL matches any ignored endpoint
      if (!ignoredEndpoints.some((endpoint) => response.config.url.includes(endpoint))) {
        console.log('Response received from:', response.config.url);
      }
      return response; // Return the response as is
    },
    (error) => {
      const requestUrl = error.response?.config?.url || '';
      const { status } = error.response || {};
      let errorMessage = 'An unexpected error occurred.';

      // Skip error handling for ignored endpoints
      if (ignoredEndpoints.some((endpoint) => requestUrl.includes(endpoint))) {
        return Promise.reject(error); // Simply reject the error
      }

      // Handle errors for other endpoints
      switch (status) {
        case 400:
          errorMessage = 'Bad Request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 404:
          errorMessage = 'Not Found. The requested resource could not be found.';
          break;
        case 500:
          errorMessage = 'Internal Server Error. Please try again later.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
          break;
      }

      // Call the error handler passed as a parameter
      if (errorHandler) {
        errorHandler(true, errorMessage); // Set error state in component
      }

      return Promise.reject(error); // Reject the error
    }
  );
};
