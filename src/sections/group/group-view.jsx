import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';

import { PageHeadView } from 'src/components/page-head';

import GroupTableView from './group-table-view';

export default function GroupView() {
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
  };
  return (
    <>
      <PageHeadView name="Groups" labelForNewButton="New Groups" onNewClick={onNewClicked} />
      <Container>
        {/* <h1>This is Group</h1> */}
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">What shall we call your group ?</DialogTitle>
          <DialogContent>
            {/* <DialogContentText id="alert-dialog-description">Forms for expense</DialogContentText> */}

            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="groupName"
                  label="Group Name"
                  type="text"
                  id="groupName"
                  autoComplete="GroupName"
                />

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
            <Button onClick={handleClose} variant='contained' autoFocus>
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <GroupTableView />
      </Container>
    </>
  );
}
