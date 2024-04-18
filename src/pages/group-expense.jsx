import { Helmet } from 'react-helmet-async';

import {GroupExpenseView} from 'src/sections/group-expense';

// ----------------------------------------------------------------------

export default function GroupExpensePage() {
  return (
    <>
      <Helmet>
        <title> Group Expense | Expense Share </title>
      </Helmet>

      <GroupExpenseView />
    </>
  );
}
