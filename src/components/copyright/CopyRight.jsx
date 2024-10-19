import { Link } from 'react-router-dom';

import Typography from '@mui/material/Typography';

export default function CopyRight(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link
        color="inherit"
        target="_blank"
        rel="noopener noreferrer"
        to="http://roshanaalemagar.com:3000/"
      >
        Expense Share
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export function ForgotPasswordSection(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="left" {...props}>
      <Link
        color="inherit"
        // target="_blank"
        rel="noopener noreferrer"
        to="/request-reset-password"
      >
        Forgot Password ?
      </Link>{' '}
    </Typography>
  );
}
