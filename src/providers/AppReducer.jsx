// AppReducer.js
import { PropTypes } from 'prop-types';
import React, { useMemo, useState, useReducer, useContext, createContext } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';

// Create a context
export const AppContext = createContext();

// Initial state
const initialState = {
  isLoading: false,
  error: null,
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW_LOADING':
      return { ...state, isLoading: true };
    case 'HIDE_LOADING':
      return { ...state, isLoading: false };
    case 'SHOW_ERROR':
      return { ...state, error: action.payload };
    case 'HIDE_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create a provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const showLoading = () => {
    dispatch({ type: 'SHOW_LOADING' });
    // setLoading(true);
  };
  const hideLoading = () => {
    dispatch({ type: 'HIDE_LOADING' });
    // setLoading(false);
  };
  const showError = (errorMessage) => dispatch({ type: 'SHOW_ERROR', payload: errorMessage });
  const hideError = () => dispatch({ type: 'HIDE_ERROR' });

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  //   const [isLoading, setLoading] = useState(true);

  // Function to show Snackbar
  const showSnackbar = (message, type = 'success') => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setAlertType(type);
  };
  // console.log(showSnackbar)

  // Function to hide Snackbar
  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };
  const contextValue = useMemo(
    () => ({
      isLoading: state.isLoading,
      error: state.error,
      showLoading,
      hideLoading,
      showError,
      hideError,
      showSnackbar,
      hideSnackbar,
    }),
    [state.isLoading, state.error] // Add any other dependencies here
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      <Box sx={{ width: '100%' }}>
      {state.isLoading &&   <LinearProgress  color="success" />}
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={()=>hideSnackbar}>
        <Alert severity={alertType}>{snackbarMessage}</Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node,
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);
