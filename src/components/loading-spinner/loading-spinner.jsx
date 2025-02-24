import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ fullHeight = false }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: fullHeight ? '100%' : '200px', // Use full height when needed
      minHeight: '200px',
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingSpinner;
LoadingSpinner.propTypes = {
  fullHeight: PropTypes.bool,
};
