import * as yup from 'yup';
import * as React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from 'src/providers/AppReducer';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import CopyRight from 'src/components/copyright/CopyRight';

import * as loginService from '../../services/auth.service';
import { NotFoundView } from '../error';

const schema = yup.object({
  password: yup.string('').required('Password is required'),
  confirmPassword: yup
    .string('')
    .oneOf([yup.ref('password')], 'Passwords does not match')
    .required('Confirm password is required'),
});
const initialValues = {
  password: '',
  confirmPassword: '',
};

const defaultTheme = createTheme();

export default function ResetPasswordView() {
  const { showSnackbar } = useAppContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('key');
  console.log(token);
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isLoading) {
        return;
      }
      setLoading(true);
      loginHandler(values);
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginHandler = async (formData) => {
    try {
      setLoading(true);
      const response = await loginService.sendPasswordResetEmail(formData.email);
      // console.log('Received', response);
      // success login
      if (response.status === 'ok') {
        setErrorMessage(null);
        setLoading(false);
        showSnackbar(response.message);
      }
    } catch (err) {
      console.log('An error has occured trying to reset password.', err.response);
      showSnackbar(
        'Resetting password failed. Something went wrong. Please check your internet',
        'error'
      );

      const { response } = err;

      if (response.data.status === 'error') {
        setErrorMessage(response.data.message);
        showSnackbar(response.data.message, 'error');
      }
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <NotFoundView />;
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url('assets/images/account.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                // alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                  <Avatar
                    sx={{
                      m: 1,
                      bgcolor: 'secondary.main',
                    }}
                  />
                  <div>
                    <Typography component="h1" variant="h4">
                      Auth
                    </Typography>
                  </div>
                </div>
              </div>

              <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="password"
                  autoFocus
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  name="confirmPassword"
                  autoComplete="confirmPassword"
                  autoFocus
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />

                <Box>
                  <div className="container">
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                  </div>
                </Box>

                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                  loadingIndicator="Sending email..."
                  sx={{ mt: 3, mb: 2 }}
                  // onClick={handleClick}
                >
                  Send Email
                </LoadingButton>
                <Grid container>
                  <Grid item xs>
                    <Link to="/home" variant="body2">
                      Back
                    </Link>
                  </Grid>
                </Grid>
                <CopyRight sx={{ mt: 5 }} />
              </Box>
            </div>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
