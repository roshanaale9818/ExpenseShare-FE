import { Helmet } from 'react-helmet-async';
import { RequestResetPasswordView } from 'src/sections/reset-password';
import ResetPasswordView from 'src/sections/reset-password/reset-password';

// ----------------------------------------------------------------------

export default function RequestResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> RequestResetPassword | Expense Share </title>
      </Helmet>

      <RequestResetPasswordView />
    </>
  );
}

export function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset password | Expense Share </title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
