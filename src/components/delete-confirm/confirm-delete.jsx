import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Iconify from 'src/components/iconify';


export default function ConfirmDelete({
  title,
  description,
  open: isOpen,
  data,
  onConfirmed,
  onCanceled,
  children,
  sx,
  label,
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let contentDesc = '';
  let headerContent = '';
  if (title) {
    headerContent = title;
  } else {
    headerContent = 'Are you sure you want to do this?';
  }
  if (description) {
    contentDesc = description;
  } else {
    contentDesc = 'This action cannot be undone.';
  }

  const onConfirmHandler = () => {
    onConfirmed(data);
    handleClose();
  };
  const onCancelHandler = () => {
    onCanceled(data);
    handleClose();
  };
  return (
    <>
      <MenuItem onClick={handleClickOpen} sx={{ color: 'error.main' }}>
        <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
        Delete
      </MenuItem>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{headerContent}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{contentDesc}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={onCancelHandler}>
            Cancel
          </Button>
          <Button onClick={onConfirmHandler} variant="outlined" color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
ConfirmDelete.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  open: PropTypes.bool,
  data: PropTypes.object,
  onCanceled: PropTypes.func,
  onConfirmed: PropTypes.func,
  children: PropTypes.node,
  sx: PropTypes.object,
  label: PropTypes.string,
};
