import PropTypes from 'prop-types';
import { createContext, useContext, useState, useMemo } from 'react';

const InterceptorContext = createContext();

export const InterceptorProvider = ({ children }) => {
  const [hasError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      hasError,
      errorMessage,
      setError: (status, message = '') => {
        setError(status);
        setErrorMessage(message);
      },
    }),
    [hasError, errorMessage]
  );

  return <InterceptorContext.Provider value={contextValue}>{children}</InterceptorContext.Provider>;
};

export const useInterceptor = () => useContext(InterceptorContext);

InterceptorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
