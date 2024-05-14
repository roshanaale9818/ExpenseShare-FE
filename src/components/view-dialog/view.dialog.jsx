import { useState } from 'react';
import PropTypes from 'prop-types';
import  DialogTitle  from '@mui/material/DialogTitle';
import DialogContent  from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';


// import DialogContentText  from '@mui/material/DialogContentText';

export default function ViewDialog({ children,title }) {

  const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };

  const onConfirmHandler = () => {
    // onConfirmed(data);
    handleClose();
  };
  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
        View
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title} Details</DialogTitle>
        <DialogContent > {children} </DialogContent>
        <DialogActions>
          <Button onClick={onConfirmHandler} variant="outlined" color="error">
            ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
ViewDialog.propTypes = {
  children: PropTypes.node,
  title:PropTypes.string
};
