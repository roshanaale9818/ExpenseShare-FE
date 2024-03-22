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
// import ConfirmDialog from 'src/components/confirm/confirm-dialog';

// import Scrollbar from 'src/components/scrollbar';

// import useRunOnce from 'src/hooks/useRunOnce';

import { getUserId, queryClient } from 'src/utils/http';

import * as GroupService from 'src/services/group.service';

import ErrorBlock from 'src/components/error';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';

function Row(props) {
  const { row, openDialog } = props;
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
  // const onDeleteHandler = () => {
  //   try {
  //     onDelete();
  //     handleCloseMenu();
  //   } catch (err) {
  //     console.err(err);
  //   }
  // };
  const deleteGroup = async ({id}) => {
    const response = await GroupService.deleteGroup(id);
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', getUserId()]);
      // sucessEvent();
    },
    onError: (error) => {
      console.log('Error', error);
      // setIsLoading(false);
    },
  });
  const onConfirmedHandler = (data) => {
    console.log("friy",data)
    mutate(data);
    handleCloseMenu();
  };
  const onCanceledHandler = () => {
    handleCloseMenu();
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{}</TableCell>
        <TableCell component="th" scope="row">
          <Link
            component="button"
            variant="contained"
            onClick={() => {
              console.info('navigate.');
            }}
          >
            {row.groupName}
          </Link>
        </TableCell>
        {/* <TableCell align="right">{row.groupName}</TableCell> */}
        <TableCell align="right">{row.createdAt.split('T')[0]}</TableCell>
        <TableCell align="right">{row.status}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
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

          {/* <MenuItem onClick={onDeleteHandler} sx={{ color: 'error.main' }}>
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
            Delete
          </MenuItem> */}
          <ConfirmDelete
            title="Are you sure you want to delete ?"
            description="You will not be able to recover this again."
            onConfirmed={onConfirmedHandler}
            onCanceled={onCanceledHandler}
            data={row}
            sx={{ typography: 'body2', color: 'error.main', py: 1.5, width: '100%' }}
          />
        </Popover>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    groupName: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  openDialog: PropTypes.func,
  // onDelete: PropTypes.func,
};

export default function GroupTableView(props) {
  let rows = [];
  const { onEdit, onDelete } = props;
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
    rows = data.data;
    content = (
      <>
        {rows &&
          rows.map((row) => (
            <Row
              key={row.id}
              openDialog={() => {
                onEditClickHandler(row);
              }}
              row={row}
              onDelete={() => {
                onDeleteHandler(row);
              }}
            />
          ))}

        {rows.length === 0 && <Typography variant="body">No data found.</Typography>}
      </>
    );
  }
  if (isError) {
    content = (
      <>
        (<ErrorBlock message={error} />)
      </>
    );
  }
  // console.log(isError, isPending, data, error);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Group Name</TableCell>
            <TableCell align="right">Created On</TableCell>
            <TableCell align="right">Status </TableCell>
            <TableCell align="right"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{content}</TableBody>
      </Table>
    </TableContainer>
  );
}

GroupTableView.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};
