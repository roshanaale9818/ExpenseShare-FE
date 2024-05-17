import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

import { PageHeadView } from 'src/components/page-head';

import ExpenseRequestTableView from './settlement-table-view';
// import ExpenseRequestSearchForm from './expense-request-search-form';

export default function SettlementView() {
  const hideBtn = true;
  return (
    <>
      <PageHeadView
        name="Expense Requests"
        hideNewButton={hideBtn}
        labelForNewButton="New Settlement"
      />
      <Container>
        {/* <ExpenseRequestSearchForm/> */}
        <Divider />
        <ExpenseRequestTableView />
      </Container>
    </>
  );
}
