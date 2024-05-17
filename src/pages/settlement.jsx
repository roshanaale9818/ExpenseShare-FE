import { Helmet } from 'react-helmet-async';

import { SettlementView } from 'src/sections/settlement';

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> Settlement | Expense Share </title>
      </Helmet>

      <SettlementView />
    </>
  );
}
