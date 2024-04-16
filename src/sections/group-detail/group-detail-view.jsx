import { useState } from 'react';
import { useAppContext } from 'src/providers/AppReducer';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from 'src/utils/http';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { PageHeadView } from 'src/components/page-head';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ErrorBlock from 'src/components/error/ErrorBlock';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import useMediaQuery from '@mui/material/useMediaQuery';

import Label from 'src/components/label';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import useRunOnce from 'src/hooks/useRunOnce';
import * as GroupService from 'src/services/group.service';
import * as userService from 'src/services/user.service';
import GroupMemberView from './group-member-view';
import GroupChartView from './group-chart-view';
import GroupChatView from './group-chat-view';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function GroupDetailView() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [rows, setRows] = useState([]);
  const [validEmail, setValidEmail] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showSnackbar, hideLoading } = useAppContext();

  // Function to handle the search input change
  const handleSearchChange = (event) => {
    const { value } = event.target;
    // setSearchTerm(value);
    // Start a timer to execute search after 3000ms
    debounceSearch(value);
  };

  // Debounce function to delay search execution
  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };
  const getUsers = async (email) => {
    const response = await userService.getUsers(email);
    const { status, data } = response;
    if (status === 'ok' && data) {
      setRows(data);
    } else {
      setRows([]);
    }

    console.log('response', response);
  };

  // Function to perform search operation
  const search = (term) => {
    if (!term) {
      return;
    }
    // Perform your search operation here
    console.log('Searching for:', term);
    if (term.includes('@')) {
      setSearchTerm(term);
      setValidEmail(true);
      getUsers(term);
    } else {
      setValidEmail(false);
    }
  };

  // Debounced search function
  const debounceSearch = debounce(search, 3000);
  const handleClose = () => {
    setOpen(false);
  };
  const handleConfirm = async (action, email) => {
    if (action === 'cancel') {
      setOpenConfirm(false);
    } else {
      console.log('addding', selectedMember);
      // addGroupMember();
      mutate({ email:selectedMember?.email });
    }
  };

  // async function addGroupMember() {
  //   // showLoading();
  //   try {
  //   const groupId = data.data.id;
  //     const response = await GroupService.addGroupMember(selectedMember.email, groupId);
  //     if (response.status === 'ok') {
  //       showSnackbar('Member added successfull');
  //       setOpenConfirm(false);
  //       setOpen(false);
  //       hideLoading();
  //     }
  //   } catch (err) {
  //     console.log('err', err.response);
  //     showSnackbar(err.response.data.message, 'error');
  //   }
  // }

  const addGroupMember = async ({ email }) => {
    console.log('mutating,', email);
    // showLoading();
    const groupId = data.data.id;
    const response = await GroupService.addGroupMember(email, groupId);
    return response;
  };
  const onAddMemberHandler = (user) => {
    setOpenConfirm(true);
    setSelectedMember(user);
  };
  const onNewClicked = () => {
    setOpen(true);
    setRows([]);
    setSearchTerm('');
  };
  const hideBtn = false;
  const params = useParams();
  const { groupId } = params;
  const groupPhoto = '@src/assets/images/account.jpg';
  const groupStatus = 'Active';
  const getGroupDetail = async () => {
    const response = await GroupService.getGroupDetail(groupId);
    return response;
  };
  const {
    data,
    isError,
    error: errorObject,
    isSuccess,
  } = useQuery({
    queryKey: ['group', groupId],
    queryFn: getGroupDetail,
  });

  const { mutate } = useMutation({
    mutationFn:  addGroupMember,
    onSuccess: async () => {
      // console.log("on success is called")
      queryClient.invalidateQueries({
        queryKey: ['group', groupId],
      });
      showSnackbar('Member added successfull');
      setOpenConfirm(false);
      setOpen(false);
      hideLoading();
    },
    onError: (error) => {
      const err = error;
      console.log('err', err);
      showSnackbar(err.response.data.message, 'error');
    },
  });

  let content = '';

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };

  if (isError) {
    console.log('Error', errorObject);
    content = (
      <Container>
        <ErrorBlock message={errorObject.response.data.message} />
      </Container>
    );
  }
  if (isSuccess && data) {
    content = (
      <>
        <PageHeadView
          name="Group Detail"
          hideNewButton={hideBtn}
          labelForNewButton="Add Member"
          onNewClick={onNewClicked}
        />
        <Container>
          <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Add Member</DialogTitle>
            <DialogContent>
              <Box
                component="form"
                onSubmit={handleFormSubmit}
                sx={{
                  '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div>
                  <TextField
                    required
                    id="outlined-required"
                    label="Email"
                    defaultValue="youremail@something.com"
                    onChange={handleSearchChange}
                    helperText={!validEmail && 'Enter a valid email'}
                    error={!validEmail}
                  />
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  handleClose();
                }}
              >
                Close
              </Button>
            </DialogActions>

            <TableContainer sx={{ padding: 2, marginTop: 2 }} component={Paper}>
              <Typography variant="h5" sx={{ marginTop: 2 }}>
                {searchTerm && `Search Results for : ${searchTerm}`}
              </Typography>
              <Table sx={{ minWidth: 500 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">Address</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows &&
                    rows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.email}
                        </TableCell>
                        <TableCell align="right">
                          {row.firstName} {row.lastName}
                        </TableCell>
                        <TableCell align="right">{row.street}</TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => {
                              onAddMemberHandler(row);
                            }}
                            size="small"
                            variant="contained"
                          >
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {(!rows || rows.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        User not found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Dialog>
        </Container>
        {/* dialog content ends  */}
        {/* confirm dialog start here  */}
        <Container>
          <Dialog
            fullScreen={fullScreen}
            open={openConfirm}
            onClose={handleConfirm}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">
              Are you sure you want to add {selectedMember?.firstName} ?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                You are about to add {selectedMember?.firstName} as your new group member.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                size="small"
                variant="contained"
                color="error"
                autoFocus
                onClick={() => {
                  handleConfirm('cancel', selectedMember?.email);
                }}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => {
                  handleConfirm('confirm');
                }}
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
        {/* confirm dialog ends  */}
        {/* // group detail view  */}
        <Container>
          <Grid container spacing={4}>
            {/* // group detail  */}
            <Grid
              item
              xs={12}
              sx={{
                mb: '10px',
              }}
            >
              <Grid
                item
                lg={12}
                sx={{
                  mb: '10px',
                  textAlign: 'center',
                }}
              >
                <Card sx={{ padding: 5 }}>
                  <CardHeader
                    title={data ? data.data.groupName : ''}
                    subheader=""
                    sx={{ mb: 3, textAlign: 'center' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {' '}
                    <Avatar alt="Grouppicture" src={groupPhoto} sx={{ width: 128, height: 128 }} />
                  </div>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}
                  >
                    Upload Image
                    <VisuallyHiddenInput type="file" />
                  </Button>
                  <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                    Created By: {data.data?.creatorName}
                  </Typography>
                  <Typography variant="h6">
                    Status:
                    <Label color="success" sx={{ ml: 1 }}>
                      {groupStatus}
                    </Label>
                  </Typography>
                </Card>
              </Grid>

              <Grid item lg={12}>
                <GroupChartView
                  title="Group Activities"
                  subheader="last month"
                  chart={{
                    labels: [
                      '01/01/2003',
                      '02/01/2003',
                      '03/01/2003',
                      '04/01/2003',
                      '05/01/2003',
                      '06/01/2003',
                      '07/01/2003',
                      '08/01/2003',
                      '09/01/2003',
                      '10/01/2003',
                      '11/01/2003',
                    ],
                    series: [
                      // {
                      //   name: 'Team A',
                      //   type: 'column',
                      //   fill: 'solid',
                      //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                      // },
                      {
                        name: 'Expense',
                        type: 'area',
                        fill: 'gradient',
                        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                      },
                      {
                        name: 'Members',
                        type: 'line',
                        fill: 'solid',
                        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                      },
                    ],
                  }}
                />
              </Grid>
            </Grid>

            {/* group detail ends  */}
            <Grid item xs={12} sm={6} md={6}>
              <Card sx={{ padding: 2 }}>
                <GroupMemberView groupMembers={data.data.Members} isAdmin={data.data.isAdmin} />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <GroupChatView />
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return <>{content}</>;
}
