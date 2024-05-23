import * as yup from 'yup';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { getUserId, queryClient } from 'src/utils/http';

import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';

import { PageHeadView } from 'src/components/page-head';

import GroupTableView from './group-table-view';

export default function GroupView() {
  const schema = yup.object({
    groupName: yup.string('Enter your group name').required('Name is required'),
  });
  const initialValues = {
    groupName: '',
  };
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('new');

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      // submitHandler(values);
      mutate(values);
    },
  });
  const [isOpen, setOpen] = useState(false);
  // const [mode,setMode]= useState('add');
  const handleClose = (event, reason = null) => {
    if (reason && reason === 'backdropClick') return;
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
    setMode('new');
    formik.resetForm();
  };

  const submitHandler = async (formData) => {
    setIsLoading(true);
    showLoading();
    let response;
    if (mode === 'new') {
      response = await GroupService.addGroup(formData.groupName);
      return response;
    }

    response = await GroupService.editGroup(formData);
    return response;
  };

  const { showSnackbar, showLoading, hideLoading } = useAppContext();

  const sucessEvent = () => {
    showSnackbar('Data saved successfull.');
    setIsLoading(false);
    setOpen(false);
    formik.resetForm();
    hideLoading();
  };

  const { mutate } = useMutation({
    mutationFn: submitHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', getUserId()]);
      sucessEvent();
    },
    onError: (error) => {
      console.log('Error', error);
      setIsLoading(false);
      showSnackbar('Data failed to save.', 'error');
      hideLoading();
    },
  });

  const onEditGroupHandler = (group) => {
    setMode('edit');
    setOpen(true);
    formik.setValues({
      groupName: group.groupName,
      groupId: group.id,
    });
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
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {/* // grid */}
        <GroupTableView onEdit={onEditGroupHandler} />
      </Container>
    </>
  );
}
