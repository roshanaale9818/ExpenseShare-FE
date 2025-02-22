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
import { PropTypes } from 'prop-types';
import { StatusOptions } from 'src/utils/helper';

export default function ExpenseFilterView({ data, onFilterDataChange }) {
  const [open, setOpen] = useState(false);
  const schema = yup.object({
    group: yup.string('Enter Group').required('Group is required'),
    status: yup.string('Enter status'),
  });
  const initialValues = {
    group: '',
    status: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      console.log('values', values);
      onFilterDataChange(values);
    },
  });

  // reset form handler get initial form
  const onResetHandler = () => {
    console.log('calling reset');
    formik.resetForm();
    onFilterDataChange({ group: '', status: '' });
  };

  const handleGroupChange = (event) => {
    const newGroupValue = event.target.value;
    // Reset expenseTitle field when group is changed
    if (newGroupValue !== formik.values.group) {
      formik.setFieldValue('status', ''); // Reset expenseTitle
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
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>

                    {data &&
                      data.map((row, index) => (
                        <MenuItem key={row.id} value={row.id}>
                          {row.groupName}
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
                  >
                    {StatusOptions &&
                      StatusOptions.map((status, index) => (
                        <MenuItem key={index} value={status.value}>
                          {status.label}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
              </Grid>
              <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary">
                Search
              </Button>
              <Button
                sx={{ mt: 2, ml: 2 }}
                type="button"
                onClick={onResetHandler}
                variant="contained"
                color="error"
              >
                Reset
              </Button>
            </form>
          </Container>
        </Collapse>
      </CardContent>
    </Card>
  );
}

ExpenseFilterView.propTypes = {
  data: PropTypes.array,
  onFilterDataChange: PropTypes.func,
};
