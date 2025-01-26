import Container from '@mui/material/Container';
import { PageHeadView } from 'src/components/page-head';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// import { queryClient } from 'src/utils/http';
// import { useAppContext } from 'src/providers/AppReducer';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as settlementService from 'src/services/settlement.service';
import SettlementGridView from './settlement-grid-view';

// import ExpenseRequestSearchForm from './expense-request-search-form';

export default function SettlementView() {
  // const { showSnackbar } = useAppContext();
  let groups = [];
  const navigate = useNavigate();

  // loaded form data when edit is clicked
  // let formData = {};
  const schema = yup.object({
    group: yup.string('Enter Group').required('Group is required.'),
  });
  const initialValues = {
    group: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      navigate(`/auth/settlement/${values.group}/preview?groupName=`);
    },
  });
  const [isOpen, setOpen] = useState(false);
  // const [mode, setMode] = useState('new');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (event, reason = null) => {
    if (reason && reason === 'backdropClick') return;
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
    formik.resetForm();
  };

  const getUserGroups = async (_data, _page = 1, _limit = 10) => {
    const response = await settlementService.getGroupList({ page: _page, limit: _limit });
    console.log('res', response);
    return response;
  };

  const onExpenseEditHandler = async (data) => {
    setOpen(true);
    // patch the value to the form
    formik.setValues({
      group: data.groupId ?? '',
    });
  };

  const { data: userGroupData } = useQuery({
    queryKey: ['settlementUserGroups', 'expense'],
    queryFn: getUserGroups,
  });
  if (userGroupData) {
    groups = userGroupData.data;
  }

  const hideBtn = false;
  const fullWidth = true;
  return (
    <>
      <PageHeadView
        name="Settlements"
        hideNewButton={hideBtn}
        onNewClick={() => {
          onNewClicked();
        }}
        labelForNewButton="New Settlement"
      />
      <Container>
        <Box className="dialog__wrap">
          <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={fullWidth}
          >
            <DialogTitle id="alert-dialog-title">Select Group</DialogTitle>

            <DialogContent>
              <Alert severity="info">Groups where you are admin appears here.</Alert>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{
                  '& .MuiTextField-root': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <FormControl
                      sx={{ m: 1 }}
                      fullWidth
                      error={formik.touched.group && Boolean(formik.errors.group)}
                    >
                      <InputLabel id="group-select">Group</InputLabel>
                      <Select
                        labelId="group-select"
                        id="demo-simple-select-helper"
                        label="Group"
                        onChange={formik.handleChange}
                        value={formik.values.group}
                        onBlur={formik.handleBlur}
                        name="group"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {groups &&
                          groups.map((row, index) => (
                            <MenuItem key={row.id} value={row.id}>
                              {row.groupName}
                            </MenuItem>
                          ))}
                      </Select>

                      {formik.touched.group && formik.errors.group && (
                        <FormHelperText>{formik.errors.group}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
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
                View Preview
              </LoadingButton>
            </DialogActions>
          </Dialog>
        </Box>

        <SettlementGridView onEdit={onExpenseEditHandler} />
      </Container>
    </>
  );
}
