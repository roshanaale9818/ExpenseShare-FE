import * as yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import * as GroupService from 'src/services/group.service';
// import DialogContentText from '@mui/material/DialogContentText';

import { PageHeadView } from 'src/components/page-head';

import GroupTableView from './group-table-view';

const schema = yup.object({
  groupName: yup.string('Enter your group name').required('Name is required'),
});
const initialValues = {
  groupName: '',
};
export default function GroupView() {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnack, setSnackBar] = useState(false);
  const [snackBarMsg, setSnackBarMsg] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      submitHandler(values);
    },
  });
  const [isOpen, setOpen] = useState(false);
  // const [mode,setMode]= useState('add');
  const handleClose = () => {
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
  };

  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      setSnackBar(false);
      return;
    }

    setSnackBar(false);
  };

  const submitHandler = async (formData) => {
    setIsLoading(true);
    try {
      const response = await GroupService.addGroup(formData.groupName);
      if (response.status === 'ok') {
        setSnackBarMsg(response.message);
        setIsLoading(false);
        setSnackBar(true);
        setOpen(false);
        formik.resetForm();
      }
    } catch (err) {
      console.log('An error has occured while logging in', err.response);
      const { response } = err;

      if (response.data.status === 'error') {
        // setErrorMessage(response.data.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageHeadView name="Groups" labelForNewButton="New Groups" onNewClick={onNewClicked} />
      <Container>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">What shall we call your group ?</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
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
                sx={{
                  height: '100px',
                }}
                name="groupName"
                label="Group Name"
                type="text"
                id="groupName"
                autoComplete="GroupName"
                value={formik.values.groupName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.groupName && Boolean(formik.errors.groupName)}
                helperText={formik.touched.groupName && formik.errors.groupName}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="error">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              onClick={formik.handleSubmit}
              variant="contained"
              color="primary"
              loading={isLoading}
              loadingIndicator="Saving.."
              sx={{ mt: 0, mb: 0 }}
            >
              Create
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <GroupTableView />
      </Container>

      <Snackbar
        open={openSnack}
        onClose={handleSnackBarClose}
        autoHideDuration={5000}
        message={snackBarMsg}
      />
    </>
  );
}
