import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from 'src/providers/AppReducer';

import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/material/Autocomplete';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import Checkbox from '@mui/material/Checkbox';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import CopyRight from 'src/components/copyright/CopyRight';
// import ConfirmDialog from 'src/components/confirm/confirm-dialog';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import * as authService from '../../services/auth.service';

// import _http from 'src/utils/http';

import { COUNTRIES } from '../../utils/countries';

const getCharacterValidationError = (str) => {
  if (!str) {
    return '';
  }
  const msg = `Your password must have at least 1 ${str} character`;
  return msg;
};
const initValues = {
  firstName: '',
  email: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  country: '',
  contact: '',
  password: '',
  confirmPassword: '',
  postalCode: '',
};
const schema = Yup.object().shape({
  firstName: Yup.string('Enter your firstName').required('FirstName is required'),
  email: Yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  lastName: Yup.string('Enter your lastname').required('LastName is required'),
  password: Yup.string('Enter your password')
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required')
    // different error messages for different requirements
    .matches(/[0-9]/, getCharacterValidationError('digit'))
    .matches(/[a-z]/, getCharacterValidationError('lowercase'))
    .matches(/[A-Z]/, getCharacterValidationError('uppercase')),
  confirmPassword: Yup.string('Enter your password')
    .required('Please retype your password')
    // use oneOf to match one of the values inside the array.
    // use "ref" to get the value of passwrod.
    .oneOf([Yup.ref('password')], 'Passwords does not match'),
  street: Yup.string().required('Street is required'),
  city: Yup.string().required('City  is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
  contact: Yup.string().required('Contact is required'),
  postalCode: Yup.string().required('Postal Code is required'),
});
const defaultTheme = createTheme();

export default function SignUpView() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState(null);
  const [resultType, setResultType] = useState('error');
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { showSnackbar } = useAppContext();

  const submitHandler = async (formData) => {
    try {
      setLoading(true);
      const response = await authService.signUp(formData);
      // success register
      if (response.status === 'ok') {
        setResMessage(response.message);
        setResultType('success');
        setLoading(false);
        formik.resetForm();
        // show alert
        showSnackbar(response.message);
      }
    } catch (err) {
      console.error('An error has occured while signing up', err, err.response);
      const { response } = err;
      setLoading(false);
      setResultType('error');
      if (response.data.status === 'error') {
        setResMessage(response.data.errors[0]); // show one error at a time

        // show alert
        showSnackbar(response.data.errors[0], 'error');
      }
    }
  };

  const formik = useFormik({
    initialValues: initValues,
    validationSchema: schema,
    onSubmit: (value) => {
      if (isLoading) {
        return;
      }
      setLoading(true);
      submitHandler(value);
    },
  });
  const onCountryChangeHandler = (event, value) => {
    formik.values.country = value.label;
    formik.handleChange(event);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: 'auto' }}>
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
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>{/* <LockOutlinedIcon /> */}</Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box sx={{ mt: 1 }}>
              <form name="signUpForm" id="signUpForm" onSubmit={formik.handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="firstName"
                  label="First Name"
                  type="text"
                  id="firstName"
                  autoComplete="firstName"
                  autoFocus
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  type="text"
                  id="lastName"
                  autoComplete="lastName"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <Box>
                  <TextField
                    // error={isError}
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    autoComplete="current-password"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="confirm-password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                  helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="street"
                  label="Street"
                  type="text"
                  id="street"
                  autoComplete="street"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.street && Boolean(formik.errors.street)}
                  helperText={formik.touched.street && formik.errors.street}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="city"
                  label="City"
                  type="text"
                  id="city"
                  autoComplete="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.city && Boolean(formik.errors.city)}
                  helperText={formik.touched.city && formik.errors.city}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="state"
                  label="State"
                  type="text"
                  id="state"
                  autoComplete="State"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="postalCode"
                  label="Postal Code"
                  type="number"
                  id="postalCode"
                  autoComplete="postalCode"
                  value={formik.values.postalCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                  helperText={formik.touched.postalCode && formik.errors.postalCode}
                />

                <Autocomplete
                  id="country-select"
                  margin="normal"
                  required
                  options={COUNTRIES}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  onChange={onCountryChangeHandler}
                  onBlur={formik.handleBlur}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                      />
                      {option.label} ({option.code}){/* +{option.phone} */}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      label="Choose a country"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}
                      value={formik.values.country}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.country && Boolean(formik.errors.country)}
                      helperText={formik.touched.country && formik.errors.country}
                    />
                  )}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="contact"
                  label="Contact"
                  type="number"
                  id="contact"
                  autoComplete="contact"
                  value={formik.values.contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.contact && Boolean(formik.errors.contact)}
                  helperText={formik.touched.contact && formik.errors.contact}
                />

                {/* <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  form="signUpForm"
                >
                  Submit
                </Button> */}
                {resMessage && <Alert severity={resultType}>{resMessage}</Alert>}
                <LoadingButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isLoading}
                  loadingIndicator="Loading..."
                  sx={{ mt: 3, mb: 2 }}
                  // onClick={handleClick}
                >
                  Submit
                </LoadingButton>
                <Grid container>
                  <Grid item xs>
                    <Link to="/login" variant="body2">
                      Back to Login
                    </Link>
                  </Grid>
                </Grid>
                <CopyRight sx={{ mt: 5 }} />
              </form>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
