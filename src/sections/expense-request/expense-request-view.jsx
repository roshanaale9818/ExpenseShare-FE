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

import ExpenseRequestTableView from './expense-request-table-view';

export default function ExpenseRequestView() {
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
  };
  const hideBtn = true;
  return (
    <>
      <PageHeadView
        name="Expense Requests"
        hideNewButton={hideBtn}
        labelForNewButton="New Expense"
        onNewClick={onNewClicked}
      />
      <Container>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Add Expense</DialogTitle>
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
           <div>
        <TextField
          required
          id="outlined-required"
          label="Required"
          defaultValue="Hello World"
        />
        </div>

      </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose} autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <ExpenseRequestTableView />
      </Container>
    </>
  );
}
