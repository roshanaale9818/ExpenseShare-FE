import { Helmet } from 'react-helmet-async';

import { HomeView } from 'src/sections/home'; 

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title> Home | Expense Share </title>
      </Helmet>

      <HomeView />
    </>
  );
}
