import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@tanstack/react-query';

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
import { queryClient } from 'src/utils/http';
import { useAppContext } from 'src/providers/AppReducer';
import * as ExpenseService from 'src/services/expense.service';

import ErrorBlock from 'src/components/error';
import { useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Alert from '@mui/material/Alert';
import { getTwoDigitNumber } from 'src/utils/format-number';
import ConfirmDialog from 'src/components/confirm/confirm-dialog';
import { SettlementStatus } from 'src/utils/helper';
import ViewDialog from 'src/components/view-dialog/view.dialog';

function Row(props) {
  const { showSnackbar, showLoading, hideLoading } = useAppContext();
  const navigate = useNavigate();
  const { row, serial } = props;
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
    navigate(`/auth/group/${group.groupId}/detail?groupName=${group.groupName}`, group);
  };
  const updateExpenseRequest = async (expense) => {
    const response = await ExpenseService.updateExpenseRequest(expense);
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: updateExpenseRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['expense']);
      showSnackbar('Expense saved successfull.', 'success');
      // sucessEvent();
      hideLoading();
    },
    onError: (error) => {
      console.log('Error', error);
      showSnackbar('Expense save failed.', 'error');
      hideLoading();
      // setIsLoading(false);
    },
  });
  const onConfirmedHandler = (data, action) => {
    showLoading();
    const _data = {
      ...data,
      isVerified: '1',
      status: action === 'accept' ? SettlementStatus.ACCEPTED : SettlementStatus.REJECTED,
    };

    mutate(_data);
    handleCloseMenu();
  };

  let actionContent = '';
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
              <Typography variant="body1">{row.addedBy}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 600 }} className="label">
                Group Name:
              </Typography>
              <Typography variant="body1">{row.groupName}</Typography>
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
              <Typography variant="body1">{row.createdAt.replace('T', ' ')}</Typography>
            </Grid>
            {/* Add more details here as needed */}
          </Grid>
        </ViewDialog>
      </MenuItem>
    </Popover>
  );

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
            {row.groupName}
          </Link>
        </TableCell>
        <TableCell align="right">
          $AUD{' '}
          <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
            {getTwoDigitNumber(row.amount)}
          </Typography>
        </TableCell>
        <TableCell>{row.description}</TableCell>
        <TableCell>
          {row.addedBy}
          {/* {row.status} */}
        </TableCell>

        <TableCell sx={{ display: 'flex' }}>
          {/* accept the request  */}
          <ConfirmDialog
            title={`Are you sure you want to accept ${row.title}?`}
            description="You are going to accept the expense."
            onConfirmed={() => {
              onConfirmedHandler(row, 'accept');
            }}
            onCanceled={() => {}}
            color="success"
            buttonSize="small"
            label="Accept"
            variant="outlined"
            sx={{ marginRight: '4px' }}
          />

          {/* reject the request  */}
          <ConfirmDialog
            title={`Are you sure you want to reject ${row.title}?`}
            description="You are going to reject the expense."
            onConfirmed={() => {
              onConfirmedHandler(row, 'reject');
            }}
            onCanceled={() => {}}
            color="error"
            buttonSize="small"
            label="Reject"
            variant="outlined"
            sx={{ marginRight: '4px' }}
          />
        </TableCell>

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
    addedBy: PropTypes.string,
    isAdmin: PropTypes.string,
    title: PropTypes.string,
    amount: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
  serial: PropTypes.number,
  // openDialog: PropTypes.func,
  // onDelete: PropTypes.func,
};

export default function ExpenseRequestTableView() {
  let rows = [];
  const getExpenseRequest = async (_data, _page = 1, _limit = 10) => {
    const response = await ExpenseService.getExpenseRequest({ page: _page, limit: _limit });
    return response;
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
    queryKey: ['expense'],
    queryFn: getExpenseRequest,
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
                onDeleteHandler(row);
              }}
            />
          ))}

        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} align="center">
              <Typography variant="body">No request found.</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    );
  }
  if (isError) {
    console.error(error);
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
      <Alert variant="filled" severity="info" sx={{ mb: 2, p: 2 }}>
        If you are admin of any group, All the pending expense request will appear here.
      </Alert>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell>S.N</TableCell>
            <TableCell>Expense Title</TableCell>
            <TableCell>Associated Group</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Added By </TableCell>
            <TableCell align="right">Action</TableCell>
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
