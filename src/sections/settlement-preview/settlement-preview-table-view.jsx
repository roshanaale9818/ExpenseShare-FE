import { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@tanstack/react-query';

import Grid from '@mui/material/Grid';
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
import Label from 'src/components/label';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import * as settlmentService from 'src/services/settlement.service';
import * as ExpenseService from 'src/services/expense.service';

import ErrorBlock from 'src/components/error';
import { useNavigate, useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
// import Alert from '@mui/material/Alert';
import { getTwoDigitNumber } from 'src/utils/format-number';
import ViewDialog from 'src/components/view-dialog/view.dialog';
import { getFormatedDate, SettlementStatus, stringAvatar } from 'src/utils/helper';
// import Button from '@mui/material/Button';
import { useAppContext } from 'src/providers/AppReducer';
import ExpenseModel from 'src/components/UI/model/expenseModel';
import { queryClient } from 'src/utils/http';
import ConfirmDelete from 'src/components/delete-confirm/confirm-delete';

function Row(props) {
  const navigate = useNavigate();
  const { showSnackbar } = useAppContext();
  const { row, serial, onEdit, onDelete } = props;
  const handleCloseMenu = () => {
    setPopOverMenu(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenMenu = (event) => {
    setPopOverMenu(true);
    setAnchorEl(event.currentTarget);
  };
  const [popoverMenuIsOpen, setPopOverMenu] = useState(false);

  const onGroupViewHandler = (group) => {
    navigate(`/auth/group/${group.groupId}/detail?groupName=${group.Group.groupName}`, group);
  };

  const onEditClicked = (data) => {
    try {
      if (data.status !== SettlementStatus.ACCEPTED) {
        showSnackbar('Expense cannot be changed.', 'error');
        return;
      }
      onEdit(data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>{serial + 1}</TableCell>
        <TableCell>{row.title}</TableCell>
        <TableCell component="th" scope="row">
          <Link
            component="button"
            variant="contained"
            onClick={() => {
              onGroupViewHandler(row);
            }}
          >
            {row.Group.groupName}
          </Link>
        </TableCell>
        <TableCell align="right">
          $AUD{' '}
          <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
            {getTwoDigitNumber(row.amount)}
          </Typography>
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell sx={{ cursor: 'pointer', padding: '0px' }}>
          <Tooltip title={`${row.Member.user.firstName} ${row.Member.user.lastName}`}>
            <Avatar {...stringAvatar(`${row.Member.user.firstName} ${row.Member.user.lastName}`)} />
          </Tooltip>
        </TableCell>
        <TableCell>
          <Label color="primary">{row.status}</Label>
        </TableCell>

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
          <MenuItem>
            <ViewDialog title="Expense">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle" sx={{ fontWeight: 600 }} className="label">
                    Title:
                  </Typography>
                  <Typography variant="body1">{row.title}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                    Amount:
                  </Typography>
                  <Typography variant="body1">{getTwoDigitNumber(row.amount)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                    Added By:
                  </Typography>
                  <Typography variant="body1">{row.Member.memberName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                    Group Name:
                  </Typography>
                  <Typography variant="body1">{row.Group.groupName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                    Description:
                  </Typography>
                  <Typography variant="body1">{row.description}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                    Created At:
                  </Typography>
                  <Typography variant="body1">{getFormatedDate(row.createdAt)}</Typography>
                </Grid>
              </Grid>
            </ViewDialog>
          </MenuItem>
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
            onConfirmed={() => {
              onDelete(row);
            }}
            onCanceled={() => {}}
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
    Group: PropTypes.object,
    groupName: PropTypes.string,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    addedBy: PropTypes.string,
    isAdmin: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
    Member: PropTypes.object,
  }).isRequired,
  serial: PropTypes.number,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default function SettlementPreviewTable(props) {
  let rows = [];
  const params = useParams();
  const { showSnackbar } = useAppContext();
  const { groupId } = params;
  const { onEditExpense } = props;
  const [openEdit, setOpenEdit] = useState(false);
  const [activeExpense, setActiveExpense] = useState(null);
  const getAcceptedExpense = async (_data, _page = 1, _limit = 10) => {
    const response = await settlmentService.getAccepetedExpense({
      page: _page,
      limit: _limit,
      groupId,
    });
    return response;
  };
  const deleteExpense = async ({ id }) => {
    const response = await ExpenseService.deleteExpense(id);
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      // queryClient.invalidateQueries(['expense']);
      queryClient.invalidateQueries(['settlementpreview', 'expense']);
      showSnackbar('Expense deleted successfull.', 'success');
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar(error.response.data.message, 'error');
    },
  });

  const addExpenseHandler = async (values) => {
    let response;
    const expense = {
      ...values,
      status: 'ACCEPTED',
      isVerified: '1',
    };
    // if it is edit
    // console.log(expense);
    if (expense.id) {
      response = await ExpenseService.editExpense(expense);
    } else {
      response = await ExpenseService.addExpense(expense);
    }
    return response;
  };
  const { mutate: expenseMutate } = useMutation({
    mutationFn: addExpenseHandler,
    onSuccess: () => {
      queryClient.invalidateQueries(['settlementpreview', 'expense']);
      showSnackbar('Expense added successfull.', 'success');
    },
    onError: (error) => {
      try {
        const errMsg = error.response.data.errors[0] || 'Something went wrong.';
        showSnackbar(errMsg, 'error');
      } catch (err) {
        showSnackbar(error.response.data.message, 'error');
      }
    },
  });

  const paginationChangeHandler = (event, page) => {
    console.log('EVENT', event, page);
  };

  const { isError, data, error } = useQuery({
    queryKey: ['settlementpreview'],
    queryFn: getAcceptedExpense,
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
              row={row}
              serial={index}
              onDelete={() => {
                mutate(row);
              }}
              onEdit={(expense) => {
                setActiveExpense(expense);
                setOpenEdit(true);
              }}
            />
          ))}

        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Typography variant="body">No data found.</Typography>
            </TableCell>
          </TableRow>
        )}
        {openEdit && (
          <ExpenseModel
            openStatus={openEdit}
            onSubmission={(expense) => {
              // console.log('sin', expense);
              setOpenEdit(false);
              expenseMutate(expense);
            }}
            data={activeExpense}
            onClose={() => {
              setOpenEdit(false);
            }}
          />
        )}
      </TableBody>
    );
  }
  if (data && data.status === 'error') {
    content = (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} sx={{ textAlign: 'center' }}>
            No Expense found. Check if their status are accepted.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
  if (isError) {
    content = (
      <TableBody>
        <TableRow>
          <TableCell>
            <ErrorBlock message="An Error occured on pending Request" />
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
            <TableCell>Description</TableCell>
            <TableCell>Paid By</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Action</TableCell>
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
SettlementPreviewTable.propTypes = {
  onEditExpense: PropTypes.func,
};
