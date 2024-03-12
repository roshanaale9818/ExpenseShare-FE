// import { memo } from 'react';
import { Helmet } from 'react-helmet-async';

import { SignUpView } from 'src/sections/signup';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  // const page = memo(SignUpView);
  return (
    <>
      <Helmet>
        <title> SignUp | Expense Share </title>
      </Helmet>
      <SignUpView />
    </>
  );
}
