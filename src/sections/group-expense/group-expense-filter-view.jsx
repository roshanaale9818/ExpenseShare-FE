import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/Expand';
import * as yup from 'yup';
import { useFormik } from 'formik';

export default function GroupExpenseFilterView() {
  const [open, setOpen] = useState(false);
  const schema = yup.object({
    group: yup.string('Enter Group').required('Group is required'),
    paidBy: yup.string('Enter Paid By'),
    status: yup.string('Enter status'),
  });
  const initialValues = {
    group: '',
    paidBy: '',
    status: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log('values', values);
      // submitHandler(values);
      //   mutate(values);
    },
  });


  const handleGroupChange = (event) => {
    const newGroupValue = event.target.value;
    // Reset expenseTitle field when group is changed
    if (newGroupValue !== formik.values.group) {
        formik.setFieldValue('status', ''); // Reset expenseTitle
        formik.setFieldValue('paidBy','');
    }
    formik.handleChange(event); // Call handleChange to update formik's state
};

  return (
    <Card>
      <CardContent>
        <Box sx={{ textAlign: 'right' }}>
          <Button
            sx={{ mb: 2 }}
            onClick={() => setOpen(!open)}
            endIcon={<ExpandMoreIcon />}
            variant="outlined"
          >
            {open ? 'Hide Filter' : 'Open Filter'}
          </Button>
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Container>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Group *"
                    name="group"
                    variant="outlined"
                    type="text"
                    id="group"
                    autoComplete="group"
                    value={formik.values.group}
                    onChange={handleGroupChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.group && Boolean(formik.errors.group)}
                    helperText={formik.touched.group && formik.errors.group}
                  >
                    <MenuItem value="">Select Group</MenuItem>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                    <MenuItem value="group3">Group 3</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Paid By"
                    name="paidBy"
                    variant="outlined"
                    type="text"
                    id="paidBy"
                    autoComplete="Paid By"
                    value={formik.values.paidBy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="status"
                    variant="outlined"
                    type="text"
                    id="status"
                    autoComplete="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary">
                Search
              </Button>
            </form>
          </Container>
        </Collapse>
      </CardContent>
    </Card>
  );
}
