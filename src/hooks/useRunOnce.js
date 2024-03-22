import { useEffect } from 'react';

// useRunOnce hook definition
const useRunOnce = (callback) => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this runs only once on mount
};

export default useRunOnce;
