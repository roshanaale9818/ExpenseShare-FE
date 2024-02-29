import { Helmet } from 'react-helmet-async';

import { SignInView } from 'src/sections/signin';

// ----------------------------------------------------------------------

export default function SignInPage() {
  return (
    <>
      <Helmet>
        <title> Login | Expense Share </title>
      </Helmet>

      <SignInView />
    </>
  );
}
