import { useState } from 'react';
import * as yup from 'yup';

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

import TextField from '@mui/material/TextField';

import { PageHeadView } from 'src/components/page-head';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import ExpenseTableView from './expense-table-view';

export default function ExpenseView() {
  const schema = yup.object({
    expenseTitle: yup.string('Enter Title').required('Title is required'),
    amount: yup.number('Enter Amount').required('Amount is required'),
  });
  const initialValues = {
    expenseTitle: '',
    amount: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      // submitHandler(values);
      // mutate(values);
    },
  });
  const [isOpen, setOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
    console.log(setIsLoading);
  };
  const onAgeChangeHandler = () => {};
  return (
    <>
      <PageHeadView name="Expenses" labelForNewButton="New Expense" onNewClick={onNewClicked} />
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
                    name="title"
                    label="Expense Title"
                    type="text"
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">Group</InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={10}
                      label="Group"
                      onChange={onAgeChangeHandler}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText>With label + helper text</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-simple-select-helper-label">Paid By</InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="demo-simple-select-helper"
                      value={10}
                      label="Paid By"
                      onChange={onAgeChangeHandler}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText>With label + helper text</FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    margin="normal"
                    required
                    name="desc"
                    label="Description"
                    type="number"
                    id="description"
                    autoComplete="Description"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.amount && Boolean(formik.errors.amount)}
                    helperText={formik.touched.amount && formik.errors.amount}
                  />
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
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>

        <ExpenseTableView />
      </Container>
    </>
  );
}
