import { PropTypes } from 'prop-types';

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';


export default function ErrorBlock({message}){
    return (
      <Alert severity="error">
      <Typography>
      {message}
      </Typography>
    </Alert>
    );
  
}


ErrorBlock.propTypes = {
  message:PropTypes.string
}

