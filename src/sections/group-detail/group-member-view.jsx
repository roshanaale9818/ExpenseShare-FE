import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { PropTypes } from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
// import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { queryClient } from 'src/utils/http';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';
import Card from '@mui/material/Card';
import CardHeader  from '@mui/material/CardHeader';
import { useMutation } from '@tanstack/react-query';
import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';
import { useParams } from 'react-router-dom';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function GroupMemberView({ groupMembers, isAdmin}) {
  const {groupId} = useParams();
  const [isOpen, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const handleClose = () => {
    setOpen(false);
  };
  const onConfirmedHandler = () => {
    mutate();
  };
  const onCanceledHandler = () => {};
  const onViewHandler = (member) => {
    setOpen(true);
    setSelectedMember(member);
  };
  const { showSnackbar } = useAppContext();
  const removeGroupMember = async ()=>{
      const response = await GroupService.removeGroupMember();
      return response;
  }


  const { mutate } = useMutation({
    mutationFn:  removeGroupMember,
    onSuccess: async () => {
      // console.log("on success is called")
      queryClient.invalidateQueries({
        queryKey: ['group', groupId],
      });
      showSnackbar('Member added successfull');
    },
    onError: (error) => {
      const err = error;
      console.log('err', err);
      showSnackbar(err.response.data.message, 'error');
    }
});

  let tableContent = '';
  const hideText = true;
  if (groupMembers) {
    tableContent = groupMembers.map((member) => (
      <TableRow key={member.id}>
        <TableCell>
          <Avatar src={member.avatar} />
        </TableCell>
        <TableCell>{member.memberName}</TableCell>
        <TableCell>{member.isAdmin === '1' ? 'Admin' : 'Member'}</TableCell>
        <TableCell>
          {isAdmin === '1' && (
            // <Button variant="outlined" color="error" onClick={() => handleRemoveMember(member.id)}>
            //   Remove
            // </Button>
            <ConfirmDelete
              size="small"
              title="Are you sure you want to remove?"
              description="You will not be able to recover this again."
              onConfirmed={onConfirmedHandler}
              onCanceled={onCanceledHandler}
              data={member}
              hideText={hideText}
              sx={{ typography: 'body2', color: 'error.main', py: 1.5, width: '100%' }}
            />
          )}
          <Button
            variant="contained"
            onClick={() => {
              onViewHandler(member);
            }}
            size="small"
            color="secondary"
            sx={{ m: 1 }}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ));
  } else {
    tableContent = <TableCell>No member found.</TableCell>;
  }
  return (
    <Card>
      <CardHeader title={`Group Members (${groupMembers.length})`} subheader='Members' sx={{mb:2}} />
        


      <Container>
        <Dialog
          open={isOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">View Member</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                '& .MuiTextField-root': { m: 1, width: '30ch' },
              }}
              autoComplete="off"
            >
              <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
                <Item>
                  <Typography>Name: {selectedMember?.memberName}</Typography>
                </Item>
                <Item>
                  <Typography>Id: {selectedMember?.userId}</Typography>
                </Item>
                <Item>
                  <Typography>
                    Role: {selectedMember?.isAdmin === '1' ? 'Admin' : 'Member'}
                  </Typography>
                </Item>
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="primary" onClick={handleClose}>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{tableContent}</TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
GroupMemberView.propTypes = {
  groupMembers: PropTypes.array,
  isAdmin: PropTypes.string,
};
