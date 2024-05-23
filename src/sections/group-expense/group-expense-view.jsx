import { useState } from 'react';
import * as yup from 'yup';
import { useParams, useSearchParams } from 'react-router-dom';

import { useFormik } from 'formik';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import * as GroupService from 'src/services/group.service';
import * as ExpenseService from 'src/services/expense.service';

import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from 'src/utils/http';
import { useAppContext } from 'src/providers/AppReducer';

import TextField from '@mui/material/TextField';
// import { styled } from '@mui/material/styles';
import ErrorBlock from 'src/components/error/ErrorBlock';
import { PageHeadView } from 'src/components/page-head';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';

import GroupExpenseTableView from './group-expense-table-view';
import GroupExpenseFilterView from './group-expense-filter-view';

// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });
export default function GroupExpenseView() {
  const { showSnackbar } = useAppContext();
  const params = useParams();
  const { groupId: id } = params;
  console.log('GroupID,', id);
  const [searchParams] = useSearchParams();
  const groupName = searchParams.get('groupName');
  // console.log(params,searchParams.get('groupName'))
  let groups = [];
  const schema = yup.object({
    expenseTitle: yup.string('Enter Title').required('Title is required'),
    amount: yup.number('Enter Amount').required('Amount is required').min(1),
    description: yup.string('Enter Description').required('Description is required.'),
    paidBy: yup.string('Enter Paid By').required('Paid By is required.'),
    group: yup.string('Enter Group').required('Group is required.'),
  });
  const initialValues = {
    expenseTitle: '',
    amount: 0,
    description: '',
    paidBy: '',
    group: id,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      expenseMutate(values);
    },
  });
  const [isOpen, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (event, reason = null) => {
    if (reason && reason === 'backdropClick') return;
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
    console.log(setIsLoading);
    formik.resetForm();
  };

  const getUserGroups = async (_data, _page = 1, _limit = 10) => {
    const response = await GroupService.getAllGroups({ page: _page, limit: _limit });
    return response;
  };
  const getGroupMembers = async () => {
    const response = await GroupService.getMembers(id);
    return response;
  };
  const addExpenseHandler = async (values) => {
    const response = await ExpenseService.addExpense(values);
    return response;
  };
  const { mutate: expenseMutate } = useMutation({
    mutationFn: addExpenseHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', 'expense']);
      showSnackbar('Expense added successfull.', 'success');
      handleClose();
    },
    onError: (error) => {
      try {
        console.log('Error', error);
        const errMsg = error.response.data.errors[0] || 'Something went wrong.';
        showSnackbar(errMsg, 'error');
      } catch (err) {
        showSnackbar(error.message, 'error');
      }
    },
  });

  const { data: userGroupData } = useQuery({
    queryKey: ['groups', 'expense'],
    queryFn: getUserGroups,
  });

  const {
    data: memberListData,
    isError,
    error,
  } = useQuery({
    queryKey: ['member', id],
    queryFn: getGroupMembers,
  });
  console.log('Memberlist data', memberListData);
  if (userGroupData) {
    groups = userGroupData.data;
  }
  let members = [];
  if (memberListData) {
    members = memberListData.data.Members;
  }
  const filterSubmitHandler = (values) => {
    console.log('values from form', values);
  };
  let errorContent = '';
  if (isError) {
    console.log(error);
    errorContent = <ErrorBlock message="Something went wrong please try again later." />;
  }

  return (
    <>
      <PageHeadView
        name={`${groupName} Expenses`}
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
          <DialogTitle id="alert-dialog-title">Add Request Expense</DialogTitle>
          <DialogContent>
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="expenseTitle"
                    label="Expense Title"
                    type="text"
                    placeholder="Eg.  Groceries"
                    id="expenseTitle"
                    autoComplete="Expense Title"
                    value={formik.values.expenseTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.expenseTitle && Boolean(formik.errors.expenseTitle)}
                    helperText={formik.touched.expenseTitle && formik.errors.expenseTitle}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="amount"
                    label="Expense Amount"
                    type="number"
                    id="expenseAmt"
                    autoComplete="Expense Amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    error={formik.touched.group && Boolean(formik.errors.group)}
                  >
                    <InputLabel id="group-select">Group</InputLabel>

                    <Select
                      readOnly
                      labelId="group-select"
                      id="demo-simple-select-helper"
                      label="Group"
                      // onChange={handleGroupChange}
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
                <Grid item xs={12} sm={6}>
                  <FormControl
                    sx={{ m: 1 }}
                    fullWidth
                    error={formik.touched.paidBy && Boolean(formik.errors.paidBy)}
                  >
                    <InputLabel id="paidBy-select">Paid By</InputLabel>
                    <Select
                      labelId="paidBy-select"
                      id="demo-simple-select-helper"
                      label="paidBy"
                      onChange={formik.handleChange}
                      value={formik.values.paidBy}
                      onBlur={formik.handleBlur}
                      name="paidBy"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {members &&
                        members.map((row, index) => (
                          <MenuItem key={row.id} value={row.id}>
                            {row.memberName}
                          </MenuItem>
                        ))}
                    </Select>

                    {formik.touched.paidBy && formik.errors.paidBy && (
                      <FormHelperText>{formik.errors.paidBy}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="description"
                    label="Description"
                    type="text"
                    id="description"
                    autoComplete="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    color='secondary'
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}

                  >
                    Attach  Receipt
                    <VisuallyHiddenInput type="file" />
                  </Button>
                </Grid> */}
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
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>

        {isError ? (
          errorContent
        ) : (
          <>
            <GroupExpenseFilterView members={members} onFormSubmit={filterSubmitHandler} />
            <GroupExpenseTableView />
          </>
        )}
      </Container>
    </>
  );
}
