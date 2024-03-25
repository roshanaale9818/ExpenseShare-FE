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

import Label from 'src/components/label';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import useRunOnce from 'src/hooks/useRunOnce';
import * as GroupService from 'src/services/group.service';
import GroupMemberView from './group-member-view';
import GroupChatView from './group-chat-view';

export default function GroupDetailView() {
  const [groupDetail, setGroupDetail] = useState(null);
  const [error, setError] = useState(null);
  const [groupMembers, setMembers]= useState([]);
  const [isAdmin, setAdmin]=useState('0');
  const getGroupDetail = async () => {
    try {
      const response = await GroupService.getGroupDetail(groupId);
      if (response.status === 'ok') {
        setGroupDetail(response.data);
        setMembers(response.data.Members);
        setAdmin(response.data.isAdmin)
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
  const members = [
    {
      role: 'Admin',
      name: 'Roshan ',
      id: '12',
    },
  ]; // Replace with actual member data

  console.log("Fake members", members);
  // let errorContent = '';
  let content = '';
  if (error) {
    content = (
      <Container>
        <ErrorBlock message={error} />
      </Container>
    );
  }
 else{
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
            <Card sx={{ padding: 5 }}>
              <CardHeader
                title={groupDetail ? groupDetail.groupName : ''}
                subheader=""
                sx={{ mb: 3,textAlign:'center' }}
              />
              <Avatar alt='picture' src={groupPhoto} sx={{ width: 128, height: 128 }} />
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

          {/* group detail ends  */}
          <Grid item xs={12} sm={6} md={6}>
            <Card sx={{ padding: 2 }}>
              <GroupMemberView groupMembers={groupMembers} isAdmin ={isAdmin} />
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
              <GroupChatView/>
          </Grid>
        </Grid>
      </Container>
    </>
  );
 }

  return <>
  {content}
  </>;
}
