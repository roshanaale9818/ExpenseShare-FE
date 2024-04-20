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
import { EXPENSE_STATUS } from 'src/utils/menu/pages';
import { PropTypes } from 'prop-types';

export default function GroupExpenseFilterView({members}) {
  const [open, setOpen] = useState(false);
  const schema = yup.object({
    // group: yup.string('Enter Group').required('Group is required'),
    paidBy: yup.string('Enter Paid By'),
    status: yup.string('Enter status').required("Status is required"),
  });
  const initialValues = {
    // group: '',
    paidBy: '',
    status: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log('values', values);
    },
  });

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
                    <MenuItem value="any">Anyone</MenuItem>
                    {members &&
                        members.map((member, index) => (
                          <MenuItem key={member.id} value={member.id}>
                            {member.memberName}
                          </MenuItem>
                        ))}
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
                    error={formik.touched.status && Boolean(formik.errors.status)}
                    helperText={formik.touched.status && formik.errors.status}
                  >
                    {EXPENSE_STATUS &&
                        EXPENSE_STATUS.map((expense, index) => (
                          <MenuItem key={expense.value} value={expense.value}>
                            {expense.label}
                          </MenuItem>
                        ))}
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
GroupExpenseFilterView.propTypes = {
  members:PropTypes.array
}
