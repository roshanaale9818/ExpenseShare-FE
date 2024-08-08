import { useFormik } from 'formik';
import * as yup from 'yup';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
import * as GroupService from 'src/services/group.service';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';

export default function ExpenseModel(props) {
  const { onSubmission, data, openStatus, onClose } = props;
  const [isOpen, setOpen] = useState(openStatus);
  const schema = yup.object({
    expenseTitle: yup.string('Enter Title').required('Title is required'),
    amount: yup.number('Enter Amount').required('Amount is required').min(1),
    description: yup.string('Enter Description').required('Description is required.'),
    paidBy: yup.string('Enter Paid By').required('Paid By is required.'),
    group: yup.string('Enter Group').required('Group is required.'),
    id: yup.string(),
  });
  console.log(data);
  const initialValues = {
    expenseTitle: data && data.title ? data.title : '',
    amount: data && data.amount ? data.amount : 0,
    description: data && data.description ? data.description : '',
    paidBy: data && data.MemberId ? data.MemberId : '',
    group: data && data.group_id ? data.group_id : '',
    id: data && data.id ? data.id : '',
  };
  useEffect(() => {
    if (isOpen) return;
    setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStatus]);

  useEffect(() => {
    if (!data.group_id) return;
    getMemberList(data.group_id);
  }, [data]);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      onSubmission(values);
      setIsLoading(true);
    },
  });
  const handleClose = (event, reason = null) => {
    if (reason && reason === 'backdropClick') return;
    setOpen(false);
    onClose();
  };

  const [memberList, setMemberList] = useState([]);

  const handleGroupChange = (event) => {
    const newGroupValue = event.target.value;
    // Reset expenseTitle field when group is changed
    formik.setFieldValue('paidBy', '');
    formik.handleChange(event); // Call handleChange to update formik's state
    if (!newGroupValue) {
      return;
    }
    getMemberList(newGroupValue);
  };

  const getMemberList = async (groupId) => {
    try {
      const response = await GroupService.getMembers(groupId);
      if (response.status === 'ok') {
        setMemberList(response.data.Members);
      }
    } catch (err) {
      console.error(err);
      setMemberList([]);
    }
  };

  const getUserGroups = async (_data, _page = 1, _limit = 10) => {
    const response = await GroupService.getAllGroups({ page: _page, limit: _limit });
    return response;
  };
  const [isLoading, setIsLoading] = useState(true);

  let groups = [];
  const { data: userGroupData } = useQuery({
    queryKey: ['expense'],
    queryFn: getUserGroups,
  });
  if (userGroupData) {
    groups = userGroupData.data;
  }
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Add Expense</DialogTitle>
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
                  labelId="group-select"
                  id="demo-simple-select-helper"
                  label="Group"
                  onChange={handleGroupChange}
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
                  {/* <MenuItem value={10}>Samir Tamang</MenuItem>
                  <MenuItem value={20}>Roshan Aale Magar</MenuItem>
                  <MenuItem value={30}>Rojina Ale</MenuItem> */}

                  {memberList &&
                    memberList.map((row, index) => (
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
          // loading={isLoading}
          loadingIndicator="Saving.."
          sx={{ mt: 0, mb: 0 }}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

ExpenseModel.propTypes = {
  onSubmission: PropTypes.func,
  data: PropTypes.object,
  openStatus: PropTypes.bool,
  onClose: PropTypes.func,
};
