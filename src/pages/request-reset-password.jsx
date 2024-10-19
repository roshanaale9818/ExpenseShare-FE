import { Helmet } from 'react-helmet-async';
import { RequestResetPasswordView } from 'src/sections/reset-password';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> RequestResetPassword | Expense Share </title>
      </Helmet>

      <RequestResetPasswordView />
    </>
  );
}
