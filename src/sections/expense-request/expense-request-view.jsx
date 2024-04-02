
import Container from '@mui/material/Container';

// import DialogContentText from '@mui/material/DialogContentText';

import { PageHeadView } from 'src/components/page-head';

import ExpenseRequestTableView from './expense-request-table-view';

export default function ExpenseRequestView() {
  const hideBtn = true;
  return (
    <>
      <PageHeadView
        name="Expense Requests"
        hideNewButton={hideBtn}
        labelForNewButton="New Expense"
        
      />
      <Container>
        <ExpenseRequestTableView />
      </Container>
    </>
  );
}
