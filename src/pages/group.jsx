import { Helmet } from 'react-helmet-async';

import { GroupView } from 'src/sections/group';

// ----------------------------------------------------------------------

export default function GroupPage() {
  return (
    <>
      <Helmet>
        <title> Group | Expense Share </title>
      </Helmet>

      <GroupView />
    </>
  );
}
