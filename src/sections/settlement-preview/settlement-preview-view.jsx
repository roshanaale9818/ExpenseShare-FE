import Container from '@mui/material/Container';
import { PageHeadView } from 'src/components/page-head';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import PropTypes, { string } from 'prop-types';
import * as GroupService from 'src/services/group.service';

import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { getTwoDigitNumber } from 'src/utils/format-number';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { stringAvatar } from 'src/utils/helper';
// import Badge from '@mui/material/Badge';

import { useAppContext } from 'src/providers/AppReducer';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { queryClient } from 'src/utils/http';
import * as yup from 'yup';
import ConfirmDialog from 'src/components/confirm/confirm-dialog';
import * as settlementService from 'src/services/settlement.service';
import SettlementTableView from './settlement-preview-table-view';

export default function SettlementPreview() {
  const { showSnackbar } = useAppContext();
  const [totalExpense, setTotalExpense] = useState(0); // Manage total expense in parent

  const handleTotalExpenseUpdate = (newTotalExpense) => {
    setTotalExpense(newTotalExpense); // Update total expense from child
  };
  const [expenseData, setExpenseData] = useState([]);
  const [members, setMembers] = useState([]);

  const groups = [];
  const params = useParams();
  const { groupId } = params;
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
    onSubmit: (values) => {},
  });
  const [isOpen, setOpen] = useState(false);
  const [open, setOpenDialog] = useState(false);
  let group = '';
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = (event, reason = null) => {
    if (reason && reason === 'backdropClick') return;
    setOpen(false);
  };
  const navigate = useNavigate();

  const getExpenses = async (_data, _page = 1, _limit = 10) => {
    setIsLoading(true);
    const response = await settlementService.getAccepetedExpense({
      page: _page,
      limit: _limit,
      groupId,
    });
    setIsLoading(false);
    return response;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    const daySuffix = () => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${day}${daySuffix(day)} ${month}, ${year}`;
  };
  const onExpenseEditHandler = async (data) => {
    setOpen(true);
    // patch the value to the form
    formik.setValues({
      group: data.groupId ?? '',
    });
  };

  const { data } = useQuery({
    queryKey: ['settlement', 'expense', groupId],
    queryFn: getExpenses,
  });

  if (data) {
    group = data.data[0];
  }

  const hideBtn = true;
  const fullWidth = true;
  const createSettlement = async (body) => {
    const response = await settlementService.createSettlement(body);
    return response;
  };
  const { mutate: settle } = useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries(['expense']);
      showSnackbar('Settlement successfull.', 'success');
      navigate('/auth/settlement');
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar(error.response.data.message, 'error');
    },
  });
  // const deleteExpense = async ({ id }) => {
  //   const response = await ExpenseService.deleteExpense(id);
  //   return response;
  // };

  const settlementHandler = () => {
    console.log('settle');
  };

  return (
    <section className="bg-white" style={{ boxShadow: 3, padding: '10px 0px 10px 0px' }}>
      <PageHeadView
        name={`Settlement Preview For ${group ? group.Group.groupName : 'Group'}`}
        hideNewButton={hideBtn}
        className="h1"
      />
      <Container>
        <Typography variant="h5" sx={{ marginBottom: '10px', textAlign: 'right' }}>
          As of {formatDate(new Date())}
        </Typography>
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
        <Heading title="Expenses" />
        <SettlementTableView onEdit={onExpenseEditHandler} />
        <Heading title="Members Expense" />
        <GroupMemberExpense
          memberList={[]}
          onUpdateTotalExpense={handleTotalExpenseUpdate}
          onData={(_data) => {
            setExpenseData(_data.expenses);
            setMembers(_data.members);
          }}
        />
        <TotalExpenseSections totalExpense={totalExpense} />
        <Heading title="Settlement" />
        <Settlement totalExpense={totalExpense} data={expenseData} members={members} />
        <Container
          sx={{
            display: 'flex',
            gap: '3',
            marginTop: '10px',
            alignItems: 'right',
            justifyContent: 'right',
          }}
        >
          <Button
            variant="contained"
            sx={{ marginRight: '5px' }}
            onClick={() => {
              setOpenDialog(true);
            }}
            color="error"
          >
            Cancel
          </Button>
          {/* <Button variant="contained" onClick={settlementHandler}>
            Settle
          </Button> */}

          <ConfirmDialog
            title="Are you sure you want to settle ?"
            description="You are about to settle the expense."
            onConfirmed={() => {
              settle({
                title: '',
                settledBy: '',
                remarks: '',
                expenseIds: data.data.map((x) => x.id),
                groupId,
              });
            }}
            onCanceled={() => {}}
            variant="contained"
            color="primary"
            sx={{ width: '10%' }}
            label="Settle"
          />
        </Container>

        <Dialog
          open={open}
          onClose={() => {
            setOpenDialog(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to exit without saving?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your work may not be recovered.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                navigate('/auth/');
              }}
              variant="contained"
              color="primary"
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setOpenDialog(false);
              }}
              autoFocus
            >
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </section>
  );
}

const Heading = (props) => {
  const { title } = props;
  return (
    <div
      style={{
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      <Typography variant="h4">{title}</Typography>
    </div>
  );
};
Heading.propTypes = {
  title: PropTypes.string,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MembersBlock = (props) => {
  const { onSelection } = props;
  const params = useParams();
  const { groupId } = params;
  const [membersList, setMembersList] = useState([]);
  useEffect(() => {
    getMemberList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getMemberList = async () => {
    try {
      const response = await GroupService.getMembers(groupId);
      if (response.status === 'ok') {
        setMembersList(response.data.Members);
        setPersonName(response.data.Members.map((member) => member.memberName));
      }
    } catch (err) {
      console.error(err);
      setMembersList([]);
    }
  };
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
    onSelection(membersList.filter((item) => value.includes(item.memberName)));
  };
  return (
    <div className="mb-10 pt-10 pb-10">
      <FormControl sx={{ m: 1, width: '100%' }}>
        <InputLabel id="demo-multiple-chip-label">Select Members</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Select Members" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {membersList.map((member) => (
            <MenuItem
              key={member.id}
              value={`${member.memberName}`}
              style={getStyles(`${member.memberName}`, personName, theme)}
            >
              {`${member.memberName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
MembersBlock.propTypes = {
  onSelection: PropTypes.func,
};

const TotalExpenseSections = ({ totalExpense }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        padding: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: 3,
      }}
    >
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'body',
            color: theme.palette.text.primary,
          }}
        >
          Total Expense:
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          AUD ${getTwoDigitNumber(totalExpense)}
        </Typography>
      </Box>
    </Box>
  );
};
TotalExpenseSections.propTypes = {
  totalExpense: PropTypes.number,
};

const GroupMemberExpense = ({ memberList, onUpdateTotalExpense, onData }) => {
  const params = useParams();
  const { groupId } = params;

  const getAcceptedExpense = async (_data, _page = 1, _limit = 10) => {
    const response = await settlementService.getAccepetedExpense({
      page: _page,
      limit: _limit,
      groupId,
    });
    return response;
  };

  const { isError, data, error } = useQuery({
    queryKey: ['settlementpreview'],
    queryFn: getAcceptedExpense,
  });

  // Memoize expensesByMembers
  const expensesByMembers = useMemo(() => data?.expenses || [], [data]);

  useEffect(() => {
    if (!expensesByMembers || expensesByMembers.length === 0) {
      onData([]);
      return;
    }
    const total = expensesByMembers.reduce((sum, member) => sum + member.totalExpense, 0);
    onUpdateTotalExpense(total);
    onData(data);
  }, [expensesByMembers, onUpdateTotalExpense, onData, data]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell width={10}>S.N</TableCell>
            <TableCell width={200}>Name</TableCell>
            <TableCell width={200} align="right">
              Amount
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expensesByMembers &&
            expensesByMembers.map((row, index) => (
              <TableRow key={index + 2}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'left',
                    gap: 2,
                  }}
                >
                  <Tooltip sx={{ marginRight: '10px' }} title={`${row.userName}`}>
                    <Avatar {...stringAvatar(`${row.userName}`)} />
                  </Tooltip>
                  <span className="mt-1">{`${row.userName}`}</span>
                </TableCell>
                <TableCell align="right">
                  $AUD
                  <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
                    {getTwoDigitNumber(row.totalExpense)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

          {expensesByMembers && expensesByMembers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body">No data found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

GroupMemberExpense.propTypes = {
  memberList: PropTypes.arrayOf(string),
  onUpdateTotalExpense: PropTypes.func.isRequired,
  onData: PropTypes.func.isRequired,
};

const Settlement = ({ data, totalExpense, members }) => {
  const calculateSettlement = (userId) => {
    try {
      if (!data || !Array.isArray(data)) {
        console.error('Invalid or missing data array.');
        return 0; // Default to 0 if data is unavailable
      }

      // Fetch the user's total expense safely
      const userExpense = data.find((x) => x.userId === userId)?.totalExpense || 0;
      if (!members || members.length === 0) {
        console.error('Members list is empty or undefined.');
        return 0; // Avoid division by zero
      }

      // Calculate individual share of the total expenses
      const individualShare = totalExpense / members.length;

      // Settlement calculation
      const settlement = userExpense - individualShare;

      // Round the result to 2 decimal places for accuracy
      const roundedSettlement = Math.round(settlement * 100) / 100;

      return roundedSettlement;
    } catch (error) {
      console.error('Error in calculateSettlement:', error.message);
      return 0; // Return a safe fallback value in case of errors
    }
  };
  const calculateExpense = (userId) => {
    try {
      if (!data || !Array.isArray(data)) {
        console.error('Invalid or missing data array.');
        return 0; // Default to 0 if data is unavailable
      }

      // Fetch the user's total expense safely
      const userExpense = data.find((x) => x.userId === userId)?.totalExpense || 0;
      if (!members || members.length === 0) {
        console.error('Members list is empty or undefined.');
        return 0; // Avoid division by zero
      }
      return userExpense;
    } catch (error) {
      console.error('Error in calculateSettlement:', error.message);
      return 0; // Return a safe fallback value in case of errors
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell width={10}>S.N</TableCell>
            <TableCell width={200}>Name</TableCell>
            <TableCell width={200} align="right">
              Individual Expense
            </TableCell>
            <TableCell width={200} align="right">
              Group Expense
            </TableCell>
            <TableCell width={200} align="right">
              Amount Owed/Receive
            </TableCell>
            <TableCell width={200} align="right">
              Settlement Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members &&
            members.map((row, index) => {
              const settlementAmount = calculateSettlement(row.user.id);
              const status = settlementAmount > 0 ? 'Receive' : 'Pay';
              const expense = calculateExpense(row.user.id);
              // const color = settlementAmount > 0 ? 'green' : 'red';

              return (
                <TableRow key={index + 2}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'left',
                      alignItems: 'left',
                      gap: 2,
                    }}
                  >
                    <Tooltip sx={{ marginRight: '10px' }} title={`${row.userName}`}>
                      <Avatar {...stringAvatar(`${row.memberName}`)} />
                    </Tooltip>
                    <span className="mt-1">{`${row.memberName}`}</span>
                  </TableCell>
                  <TableCell align="right">
                    $AUD
                    <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
                      {getTwoDigitNumber(Math.abs(expense))}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    $AUD
                    <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
                      {getTwoDigitNumber(totalExpense)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    $AUD
                    <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
                      {getTwoDigitNumber(Math.abs(settlementAmount))}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color={status === 'Pay' ? 'error' : 'success'}
                    >
                      {status === 'Pay' ? 'Need to Pay' : 'Need to Receive'}
                    </Button>
                  </TableCell>
                  {/* <TableCell align="right">
                    $AUD
                    <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
                      {getTwoDigitNumber(Math.abs(settlementAmount))}
                    </Typography>
                  </TableCell> */}
                </TableRow>
              );
            })}

          {data && data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <Typography variant="body">No data found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <></>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

Settlement.propTypes = {
  data: PropTypes.shape().isRequired,
  totalExpense: PropTypes.number,
  members: PropTypes.array,
};
