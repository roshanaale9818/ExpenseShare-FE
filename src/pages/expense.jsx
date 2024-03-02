import { Helmet } from 'react-helmet-async';

import { ExpenseView } from 'src/sections/expense'; 

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> Expense | Expense Share </title>
      </Helmet>

      <ExpenseView />
    </>
  );
}
