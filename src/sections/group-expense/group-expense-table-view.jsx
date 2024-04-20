// import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@tanstack/react-query';
// import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
// import Popover from '@mui/material/Popover';
// import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
// import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// import Iconify from 'src/components/iconify';
import { getUserId, queryClient } from 'src/utils/http';
import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';
import * as ExpenseService from 'src/services/expense.service';

import ErrorBlock from 'src/components/error';
// import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';
import Label from 'src/components/label';
import { useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
// import { CircularProgress } from '@mui/material';

function Row(props) {
  const { showSnackbar, hideLoading } = useAppContext();
  // const navigate = useNavigate();
  const { row, serial } = props;
  // const handleCloseMenu = () => {
  //   setPopOverMenu(false);
  // };
  // const [anchorEl, setAnchorEl] = useState(null);
  // const handleOpenMenu = (event) => {
  //   setPopOverMenu(true);
  //   setAnchorEl(event.currentTarget);
  // };
  // const [popoverMenuIsOpen, setPopOverMenu] = useState(false);
  // const onEditClicked = () => {
  //   try {
  //     openDialog(true);
  //     handleCloseMenu();
  //   } catch (err) {
  //     console.err(err);
  //   }
  // };
  // const onGroupViewHandler = (group) => {
  //   console.log(group);
  //   navigate(`/auth/group/${group.group_id}/detail?groupName=${group.groupName}`, group);
  // };
  const deleteGroup = async ({ id }) => {
    const response = await GroupService.deleteGroup(id);
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', getUserId()]);
      showSnackbar('Group deleted successfull.', 'success');
      hideLoading();
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar('Group deletion failed.', 'error');
      hideLoading();
      // setIsLoading(false);
    },
  });
  console.log('mutate is', mutate);
  // const onConfirmedHandler = (data) => {
  //   // console.log("friy",data)
  //   showLoading();
  //   mutate(data);
  //   handleCloseMenu();
  // };
  // const onCanceledHandler = () => {
  //   handleCloseMenu();
  // };

  // let actionContent = '';
  // if (row.isAdmin === '1') {
  //   actionContent = (
  //     <Popover
  //       open={!!popoverMenuIsOpen}
  //       anchorEl={anchorEl}
  //       onClose={handleCloseMenu}
  //       anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
  //       transformOrigin={{ vertical: 'top', horizontal: 'left' }}
  //       sx={{
  //         position: 'absolute',
  //       }}
  //     >
  //       <MenuItem onClick={onEditClicked}>
  //         <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
  //         Edit
  //       </MenuItem>

  //       <ConfirmDelete
  //         title="Are you sure you want to delete ?"
  //         description="You will not be able to recover this again."
  //         onConfirmed={onConfirmedHandler}
  //         onCanceled={onCanceledHandler}
  //         data={row}
  //         sx={{ typography: 'body2', color: 'error.main', py: 1.5, width: '100%' }}
  //       />
  //     </Popover>
  //   );
  // }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{serial + 1}</TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.amount}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.description}
        </TableCell>
        <TableCell>
          <Label color={(row.settlementStatus === 'PENDING' && 'secondary') || 'success'}>
            {row.settlementStatus}
          </Label>
        </TableCell>
        <TableCell align="right">
       { new Date(row.createdAt).toISOString().split('T')[0]}
          {/* {row.createdAt} */}
          </TableCell>
        {/* <TableCell align="right">
          <Label color={(row.status === '0' && 'error') || 'success'}>
            {(row.status === '1' && 'Active') || 'In active'}
          </Label>
  
        </TableCell> */}

        {/* <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>
      {/* <TableRow>{actionContent}</TableRow> */}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    amount: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    settlementStatus: PropTypes.string,
  }).isRequired,
  serial: PropTypes.number,
  // openDialog: PropTypes.func,
  // onDelete: PropTypes.func,
};

export default function GroupExpenseTableView() {
  const params = useParams();
  const { groupId } = params;
  let rows = [];
  const getExpenseList = async (_data, _page = 1, _limit = 10) => {
    const response = await ExpenseService.getGroupExpense({ page: _page, limit: _limit, groupId });
    return response;
  };

  const onEditClickHandler = () => {
    try {
      // onEdit(group);
    } catch (err) {
      console.error(err);
    }
  };
  const paginationChangeHandler = () => {};
  const onDeleteHandler = (group) => {
    try {
      // onDelete(group);
    } catch (err) {
      console.error(err);
    }
  };

  const { isError, data, error } = useQuery({
    queryKey: ['expense', getUserId()],
    queryFn: getExpenseList,
  });
  let content = '';

  if (data && data.status === 'ok') {
    rows = data.data;
    content = (
      <TableBody>
        {rows &&
          rows.map((row, index) => (
            <Row
              key={row.id}
              openDialog={() => {
                onEditClickHandler(row);
              }}
              row={row}
              serial={index}
              onDelete={() => {
                onDeleteHandler(row);
              }}
            />
          ))}

        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} align="center">
              <Typography variant="body" align="center">
                No data found.
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  }
  if (isError) {
    content = (
      <TableBody>
        <TableRow>
          <TableCell>
            (
            <ErrorBlock
              sx={{ width: 100 }}
              message={error ? error.message : 'An error has occured'}
            />
            )
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>S.N</TableCell>
            <TableCell>Title</TableCell>
            {/* <TableCell>S.N</TableCell> */}
            <TableCell>Amount</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>SettleMent Status</TableCell>
            <TableCell>Created On</TableCell>
            <TableCell align="right">Created By </TableCell>
          </TableRow>
        </TableHead>
        {content}
      </Table>

      {data && data.totalPages > 1 && (
        <Pagination
          sx={{ textAlign: 'center', justifyContent: 'center', display: 'flex', p: 3 }}
          count={data ? Number(data.totalPages) : 100}
          variant="outlined"
          shape="rounded"
          onChange={paginationChangeHandler}
        />
      )}
    </TableContainer>
  );
}

GroupExpenseTableView.propTypes = {};
