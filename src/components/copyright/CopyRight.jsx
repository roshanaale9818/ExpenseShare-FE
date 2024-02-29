import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';


export default function CopyRight(props){
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit"  target="_blank" rel="noopener noreferrer" href="http://roshanaalemagar.com:3000/">
          Expense Share
        </Link>{' '}
        {new Date().getFullYear()}
        .
      </Typography>
    );
  
}

