import { PropTypes } from 'prop-types';

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

export default function ErrorBlock({ message }) {
  console.log('message', message);
  return (
    <Alert severity="error">
      <Typography>{typeof message === 'string' ? message : 'An error has occurred.'}</Typography>
    </Alert>
  );
}

ErrorBlock.propTypes = {
  message: PropTypes.string,
};
