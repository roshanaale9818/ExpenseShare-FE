// import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation } from '@tanstack/react-query';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import { getUserId, queryClient } from 'src/utils/http';
import { useAppContext } from 'src/providers/AppReducer';
import * as GroupService from 'src/services/group.service';
import * as ExpenseService from 'src/services/expense.service';

import ErrorBlock from 'src/components/error';
import Label from 'src/components/label';
import { useParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { getTwoDigitNumber } from 'src/utils/format-number';

function Row(props) {
  const { showSnackbar, hideLoading } = useAppContext();
  // const navigate = useNavigate();
  const { row, serial } = props;
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
      console.warn(mutate);
    },
  });

  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>{serial + 1}</TableCell>
      <TableCell component="th" scope="row">
        {row.title}
      </TableCell>
      <TableCell align="right">
        $AUD{' '}
        <Typography sx={{ fontWeight: 'bold', typography: 'body' }}>
          {getTwoDigitNumber(row.amount)}
        </Typography>
      </TableCell>
      <TableCell component="th" scope="row">
        {row.description}
      </TableCell>
      <TableCell>
        <Label color={(row.status === 'PENDING' && 'secondary') || 'success'}>{row.status}</Label>
      </TableCell>
      <TableCell>
        <Label color={(row.status === 'PENDING' && 'secondary') || 'success'}>{row.status}</Label>
      </TableCell>
      <TableCell align="right">{new Date(row.createdAt).toISOString().split('T')[0]}</TableCell>
      <TableCell align="right">
        {row.Member.memberName}{' '}
        <Tooltip title="View Member Info">
          <Button sx={{ ml: 1 }} variant="outlined" color="info" size="small">
            View
          </Button>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    amount: PropTypes.number,
    createdAt: PropTypes.string,
    status: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    settlementStatus: PropTypes.string,
    Member: PropTypes.object,
  }).isRequired,
  serial: PropTypes.number,
};

export default function GroupExpenseTableView() {
  const params = useParams();
  const { groupId } = params;
  let rows = [];
  const getExpenseList = async ({ _data, _page = 1, _limit = 10 }) => {
    const response = await ExpenseService.getGroupExpense({ page: _page, limit: _limit, groupId });
    return response;
  };

  const { mutate } = useMutation({
    mutationFn: getExpenseList,
    onSuccess: () => {
      queryClient.invalidateQueries(['groups', groupId, 'expense']);
    },
    onError: (error) => {
      console.log('Error', error);
    },
  });

  const onEditClickHandler = () => {
    try {
      // onEdit(group);
    } catch (err) {
      console.error(err);
    }
  };
  const paginationChangeHandler = (event, currentPage) => {
    console.log('page', currentPage);
    mutate({ _data: [], _page: currentPage });
  };
  const onDeleteHandler = (group) => {
    try {
      // onDelete(group);
    } catch (err) {
      console.error(err);
    }
  };

  const { isError, data, error } = useQuery({
    queryKey: ['groups', groupId, 'expense'],
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
            <TableCell>Amount</TableCell>
            <TableCell>Description</TableCell>
            <TableCell> Status</TableCell>
            <TableCell>Settlement Status</TableCell>
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
