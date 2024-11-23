import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import { useInterceptor } from 'src/providers/IntercepProvider';
import { setAxiosErrorHandler } from 'src/utils/http';
import { useDispatch } from 'react-redux';
import { authActions } from 'src/store';

export default function CustomAlertDialog({ onConfirm }) {
  const [open, setOpen] = React.useState(true);
  const { hasError, errorMessage, setError } = useInterceptor();
  const dispatch = useDispatch();
  React.useEffect(() => {
    setAxiosErrorHandler(setError); // Pass setError function to handle errors
    if (hasError) {
      setOpen(true);
    }
  }, [setError, hasError]);

  if (!hasError) return null;

  const handleClose = () => {
    setOpen(true);
    setError(false, '');
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Session Expired</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your session has expired. Please log in again to continue.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button
          onClick={() => {
            setError(false, '');
            dispatch(authActions.logout());
            onConfirm();
          }}
          autoFocus
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CustomAlertDialog.propTypes = {
  onConfirm: PropTypes.func,
};
