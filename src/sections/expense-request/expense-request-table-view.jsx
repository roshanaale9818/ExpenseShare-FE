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
import Iconify from 'src/components/iconify';
import { getUserId, queryClient } from 'src/utils/http';
import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';

import ErrorBlock from 'src/components/error';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';
import Label from 'src/components/label';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';

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
  const onGroupViewHandler = (group) => {
    console.log(group);
    navigate(`/auth/group/${group.id}/detail?groupName=${group.groupName}`, group);
  };
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
              onGroupViewHandler(row);
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

export default function ExpenseRequestTableView() {
  let rows = [];
  // const { onEdit, onDelete } = props;
  // console.log("ONEDIT",onEdit);
  const getGroupList = async (_data, _page = 1, _limit = 10) => {
    const response = await GroupService.getGroupList({ page: _page, limit: _limit });
    return response;
  };

  const onEditClickHandler = () => {
    try {
      // onEdit(group);
    } catch (err) {
      console.error(err);
    }
  };
  const onDeleteHandler = (group) => {
    try {
      // onDelete(group);
    } catch (err) {
      console.error(err);
    }
  };

  const paginationChangeHandler = (event, page) => {
    console.log('EVENT', event, page);
  };

  const { isError, data, error } = useQuery({
    queryKey: ['groups', getUserId()],
    queryFn: getGroupList,
  });
  let content = '';

  if (data && data.status === 'ok') {
    // hideLoading()
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

        {rows.length === 0 && <Typography variant="body">No data found.</Typography>}
      </TableBody>
    );
  }
  if (isError) {
    content = (
      <TableBody>
        (<ErrorBlock message={error} />)
      </TableBody>
    );
  }

  return (
    
    <TableContainer component={Paper}>
        <Alert variant="filled" severity="info" sx={{mb:2,p:2}}>
         If you are admin of any group, All the pending expense request will appear here.
        </Alert>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>S.N</TableCell>
            <TableCell>Expense Title</TableCell>
            <TableCell align="right">Created On</TableCell>
            {/* <TableCell align="right">Status </TableCell> */}
            <TableCell align="right">Your role </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
      
        {content}
      </Table>
      {/* {paginationContent} */}
      {/* {totalCount} */}

      <Pagination
        sx={{ textAlign: 'center', justifyContent: 'center', display: 'flex', p: 3 }}
        count={data ? Number(data.totalItems) : 100}
        variant="outlined"
        shape="rounded"
        onChange={paginationChangeHandler}
      />
    </TableContainer>
  );
}
