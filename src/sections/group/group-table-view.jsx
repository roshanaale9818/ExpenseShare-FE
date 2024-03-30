import { useState } from 'react';
import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
import { useQuery, useMutation } from '@tanstack/react-query';

import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
// import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
// import ConfirmDialog from 'src/components/confirm/confirm-dialog';

// import Scrollbar from 'src/components/scrollbar';

// import useRunOnce from 'src/hooks/useRunOnce';

import { getUserId, queryClient } from 'src/utils/http';

import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';

import ErrorBlock from 'src/components/error';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';
import Label from 'src/components/label';
import { useNavigate } from 'react-router-dom';

function Row(props) {
  const { showSnackbar, showLoading, hideLoading } = useAppContext();
  const navigate = useNavigate();
  const { row, openDialog, serial } = props;
  const handleCloseMenu = () => {
    setPopOverMenu(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => {
    setPopOverMenu(true);
    setAnchorEl(event.currentTarget);
  };
  const [popoverMenuIsOpen, setPopOverMenu] = useState(false);
  const onEditClicked = () => {
    try {
      openDialog(true);
      handleCloseMenu();
    } catch (err) {
      console.err(err);
    }
  };
  const onGroupViewHandler = (group)=>{
      console.log(group);
      navigate(`/auth/group/${group.id}/detail?groupName=${group.groupName}`,group)
  }
  const deleteGroup = async ({ id }) => {
    const response = await GroupService.deleteGroup(id);
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', getUserId()]);
      showSnackbar('Group deleted successfull.', 'success');
      // sucessEvent();
      hideLoading();
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar('Group deletion failed.', 'error');
      hideLoading();
      // setIsLoading(false);
    },
  });
  const onConfirmedHandler = (data) => {
    // console.log("friy",data)
    showLoading();
    mutate(data);
    handleCloseMenu();
  };
  const onCanceledHandler = () => {
    handleCloseMenu();
  };

  let actionContent = '';
  if (row.isAdmin === '1') {
    actionContent = (
      <Popover
        open={!!popoverMenuIsOpen}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{
          position: 'absolute',
        }}
      >
        <MenuItem onClick={onEditClicked}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <ConfirmDelete
          title="Are you sure you want to delete ?"
          description="You will not be able to recover this again."
          onConfirmed={onConfirmedHandler}
          onCanceled={onCanceledHandler}
          data={row}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5, width: '100%' }}
        />
      </Popover>
    );
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{serial + 1}</TableCell>
        <TableCell component="th" scope="row">
          <Link
            component="button"
            variant="contained"
            onClick={() => {
              onGroupViewHandler(row)
            }}
          >
            {row.groupName}
          </Link>
        </TableCell>

        <TableCell align="right">{row.createdAt.split('T')[0]}</TableCell>
        <TableCell align="right">
          <Label color={(row.isAdmin === '0' && 'secondary') || 'success'}>
            {(row.isAdmin === '0' && 'Member') || 'Admin'}
          </Label>
          {/* {row.status} */}
        </TableCell>
        {/* <TableCell align="right">
          <Label color={(row.status === '0' && 'error') || 'success'}>
            {(row.status === '1' && 'Active') || 'In active'}
          </Label>
  
        </TableCell> */}

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>{actionContent}</TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    groupName: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    isAdmin: PropTypes.string,
  }).isRequired,
  serial: PropTypes.number,
  openDialog: PropTypes.func,
  // onDelete: PropTypes.func,
};

export default  function  GroupTableView(props) {
  let rows = [];
  const { onEdit, onDelete } = props;
  // console.log("ONEDIT",onEdit);
  const getGroupList = async (_data, _page = 1, _limit = 10) => {
    const response = await GroupService.getGroupList({ page: _page, limit: _limit });
    return response;
  };

  const onEditClickHandler = (group) => {
    try {
      onEdit(group);
    } catch (err) {
      console.error(err);
    }
  };
  const onDeleteHandler = (group) => {
    try {
      onDelete(group);
    } catch (err) {
      console.error(err);
    }
  };

  const { isError, data, error } = useQuery({
    queryKey: ['groups', getUserId()],
    queryFn: getGroupList,
  });
  let content = '';
  if (data && data.status === 'ok') {
    // hideLoading()
    rows = data.data;
    // setTotalCount(Number(data.totalItems));
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

        {rows.length === 0 && <Typography variant="body">No data found.</Typography>}
      </TableBody>
    );
  
  }
  if (isError) {
    // hideLoading()
    content = (
      <TableBody>
        (<ErrorBlock message={error} />)
      </TableBody>
    );
    // hideLoading();
  }

  // const paginationContent = (
  //   <TablePagination
  //     component="div"
  //     count={totalCount}
  //     page={page}
  //     onPageChange={handleChangePage}
  //     rowsPerPage={rowsPerPage}
  //     onRowsPerPageChange={handleChangeRowsPerPage}
  //   />
  // );
  // console.log(isError, isPending, data, error);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>S.N</TableCell>
            <TableCell>Group Name</TableCell>
            <TableCell align="right">Created On</TableCell>
            {/* <TableCell align="right">Status </TableCell> */}
            <TableCell align="right">Your role </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        {/* <TableBody>{content}</TableBody> */}
        {content}
      </Table>
      {/* {paginationContent} */}
      {/* {totalCount} */}

      
        {/* <TablePagination
          page={page}
          component="div"
          count={100}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
    
    </TableContainer>
  );
}


GroupTableView.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
