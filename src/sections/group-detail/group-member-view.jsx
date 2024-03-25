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

export default function GroupMemberView({ groupMembers, isAdmin }) {
  const handleRemoveMember = () => {};
  let tableContent = '';
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
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRemoveMember(member.id)}
            >
              Remove
            </Button>
          )}
        </TableCell>
      </TableRow>
    ));
  } else {
    tableContent = <TableCell>No member found.</TableCell>;
  }
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Group Members ({groupMembers.length})
      </Typography>
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
    </>
  );
}
GroupMemberView.propTypes = {
  groupMembers: PropTypes.array,
  isAdmin:PropTypes.string
};
