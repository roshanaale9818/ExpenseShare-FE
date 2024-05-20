import { useState } from 'react';
import PropTypes from 'prop-types';
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
import * as ExpenseService from 'src/services/expense.service';

import ErrorBlock from 'src/components/error';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';
import Label from 'src/components/label';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { getTwoDigitNumber } from 'src/utils/format-number';
import { SettlementStatus } from 'src/utils/helper';

function Row(props) {
  const { showSnackbar, showLoading, hideLoading } = useAppContext();
  const navigate = useNavigate();
  const { row, onEdit, serial } = props;
  const handleCloseMenu = () => {
    setPopOverMenu(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => {
    setPopOverMenu(true);
    setAnchorEl(event.currentTarget);
  };
  const [popoverMenuIsOpen, setPopOverMenu] = useState(false);
  const onEditClicked = (data) => {
    try {
      if (data.settlementStatus !== SettlementStatus.PENDING) {
        showSnackbar('Expense cannot be changed.', 'error');
        return;
      }
      // if this is still editable
      // pass the data into the parent
      onEdit(data);
      handleCloseMenu();
    } catch (err) {
      console.err(err);
    }
  };

  // navigate to group detail
  const onGroupViewHandler = (group) => {
    console.log(group);
    navigate(`/auth/group/${group.group_id}/detail?groupName=${group.groupName}`, group);
  };

  // delete expense if not settled yet
  const deleteExpense = async ({ id }) => {
    const response = await ExpenseService.deleteExpense(id);
    return response;
  };

  const getStatusLabel = (status) => {
    let label = '';
    switch (status) {
      case SettlementStatus.PENDING:
        label = 'primary';
        break;
      case SettlementStatus.REJECTED:
        label = 'error';
        break;
      case SettlementStatus.ACCEPTED:
        label = 'success';
        break;
      default:
        label = 'secondary';
        break;
    }
    return label;
  };

  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries(['expense']);
      showSnackbar('Group deleted successfull.', 'success');
      hideLoading();
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar(error.response.data.message, 'error');
      hideLoading();
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

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{serial + 1}</TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
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
        <TableCell>AUD {getTwoDigitNumber(row.amount)}</TableCell>
        <TableCell>
          <Label color={getStatusLabel(row.settlementStatus)}>{row.settlementStatus}</Label>
        </TableCell>

        <TableCell align="right">
          {row.settlementStatus === SettlementStatus.PENDING && (
            <IconButton onClick={handleOpenMenu}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          )}
          {/* allow edit or delete if the settlement is on pending status  */}
          {row.settlementStatus === SettlementStatus.PENDING && (
            <div>
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
                <MenuItem
                  onClick={() => {
                    onEditClicked(row);
                  }}
                >
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
            </div>
          )}
          {/* </TableCell> */}
        </TableCell>
      </TableRow>
      {/* <TableRow> */}

      {/* </TableRow> */}
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    groupName: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    isAdmin: PropTypes.string,
    title: PropTypes.string,
    settlementStatus: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  serial: PropTypes.number,
  onEdit: PropTypes.func,
  // onDelete: PropTypes.func,
};

export default function ExpenseTableView({ onEdit }) {
  let rows = [];
  const getExpenseList = async (_data, _page = 1, _limit = 10) => {
    const response = await ExpenseService.getExpenseList({ page: _page, limit: _limit });
    return response;
  };

  const onEditClickHandler = (data) => {
    try {
      onEdit(data);
    } catch (err) {
      console.error(err);
    }
  };
  const paginationChangeHandler = () => {};
  const onDeleteHandler = (data) => {
    try {
      console.log('deleting the expense', data);
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
              onEdit={() => {
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
            <ErrorBlock
              sx={{ width: 100 }}
              message={error ? error.message : 'An error has occured'}
            />
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
            <TableCell>Associated Group</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>SettleMent Status</TableCell>
            <TableCell align="right"> </TableCell>
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

ExpenseTableView.propTypes = {
  onEdit: PropTypes.func,
};
