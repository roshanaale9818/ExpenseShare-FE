import { Helmet } from 'react-helmet-async';
 
import { ExpenseRequestView } from 'src/sections/expense-request';

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> ExpenseRequest | Expense Share </title>
      </Helmet>

      <ExpenseRequestView />
    </>
  );
}
