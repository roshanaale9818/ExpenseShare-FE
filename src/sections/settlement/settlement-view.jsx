import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

import { PageHeadView } from 'src/components/page-head';

import ExpenseRequestTableView from './settlement-table-view';
// import ExpenseRequestSearchForm from './expense-request-search-form';

export default function SettlementView() {
  const hideBtn = false;
  return (
    <>
      <PageHeadView
        name="Settlements"
        hideNewButton={hideBtn}
        onNewClick={() => {
          console.log('Creating a new page');
        }}
        labelForNewButton="New Settlement"
      />
      <Container>
        <Divider />
        <ExpenseRequestTableView />
      </Container>
    </>
  );
}
