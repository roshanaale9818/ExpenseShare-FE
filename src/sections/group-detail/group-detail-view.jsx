import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { PageHeadView } from 'src/components/page-head';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import ErrorBlock from 'src/components/error/ErrorBlock';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import Label from 'src/components/label';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import useRunOnce from 'src/hooks/useRunOnce';
import * as GroupService from 'src/services/group.service';
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
  const [groupDetail, setGroupDetail] = useState(null);
  const [error, setError] = useState(null);
  const [groupMembers, setMembers] = useState([]);
  const [isAdmin, setAdmin] = useState('0');
  const getGroupDetail = async () => {
    try {
      const response = await GroupService.getGroupDetail(groupId);
      if (response.status === 'ok') {
        setGroupDetail(response.data);
        setMembers(response.data.Members);
        setAdmin(response.data.isAdmin);
      }
    } catch (err) {
      const { response } = err;
      const errorData = response.data;
      if (errorData.status === 'error') {
        console.error('Error has occured', errorData.message);
        setError(errorData.message);
      }
    }
  };

  useRunOnce(() => {
    getGroupDetail();
  });
  const [isOpen, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const onNewClicked = () => {
    setOpen(true);
  };
  const hideBtn = false;
  const params = useParams();
  const { groupId } = params;
  const groupPhoto = 'path_to_group_photo.jpg';
  const groupStatus = 'Active';

  // let errorContent = '';
  let content = '';
  if (error) {
    content = (
      <Container>
        <ErrorBlock message={error} />
      </Container>
    );
  } else {
    content = (
      <>
        {' '}
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
              {/* <DialogContentText id="alert-dialog-description">Forms for expense</DialogContentText> */}

              <Box
                component="form"
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
                    label="Required"
                    defaultValue="Hello World"
                  />
                </div>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleClose} autoFocus>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
        {/* dialog content ends  */}
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
                    title={groupDetail ? groupDetail.groupName : ''}
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
                    Created By: {groupDetail?.creatorName}
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
                <GroupMemberView groupMembers={groupMembers} isAdmin={isAdmin} />
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
