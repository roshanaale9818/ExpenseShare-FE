import Container from '@mui/material/Container';
// import  Divider  from '@mui/material/Divider';

import { PageHeadView } from 'src/components/page-head';

import ExpenseRequestTableView from './expense-request-table-view';
// import ExpenseRequestSearchForm from './expense-request-search-form';

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
        {/* <ExpenseRequestSearchForm/> */}
        {/* <Divider/> */}
        <ExpenseRequestTableView />
      </Container>
    </>
  );
}
