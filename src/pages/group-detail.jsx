import { Helmet } from 'react-helmet-async';

import { GroupDetailView } from 'src/sections/group-detail'; 

// ----------------------------------------------------------------------

export default function ExpensePage() {
  return (
    <>
      <Helmet>
        <title> Group Detail | Expense Share </title>
      </Helmet>

      <GroupDetailView />
    </>
  );
}
