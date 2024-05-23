import { Helmet } from 'react-helmet-async';

import { SettlementView } from 'src/sections/settlement';

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> Settlement Preview | Expense Share </title>
      </Helmet>

      <SettlementView />
    </>
  );
}
