import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import Autocomplete from '@mui/material/Autocomplete';
import Visibility from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import { authActions } from 'src/store';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import CopyRight from 'src/components/copyright/CopyRight';
// import ConfirmDialog from 'src/components/confirm/confirm-dialog';

import * as Yup from 'yup';
import { useFormik } from 'formik';

import _http from 'src/utils/http';

import { COUNTRIES } from '../../utils/countries';

const defaultTheme = createTheme();
export default function SignUpView() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const initValues = {
    firstName: '',
    email: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    contact: '',
    password:''
  };
  const schema = Yup.object().shape({
    firstName: Yup.string().required('FirstName is required'),
    email: Yup.string().email().required('Email is required'),
    lastName: Yup.string().required('LastName is required'),
    password: Yup.string().required('Password is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City  is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    Contact: Yup.string().required('Contact is required'),
  });

  const submitHandler = async (formValues)=>{
        console.log("formValues",formValues);
        _http.post(``);
        formik.handleBlur();
  }


console.log("CALLING FORMIK ");
  const formik = useFormik({
    initialValues: initValues,
    // enableReinitialize: true,
    validationSchema: schema,
    onSubmit: async (value)=>{
      console.log("handling submit",value);
      submitHandler("VALUE FROM FORM");
    }
  });
  console.log("CALLING FORMIK ENDS")
  // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // console.log('isLoggedIn', isLoggedIn);
  // const loginHandler = () => {};

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    formik.handleSubmit(event)
  };
  // const [isError, setError] = useState(false);
  const onFocusHandler = () => {
    // setError(true);
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
              <form name='signUpForm' id='signUpForm' onSubmit={handleSubmit}>
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
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
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
                    onFocus={onFocusHandler}
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
                />

                <Autocomplete
                  id="country-select"
                  // sx={{ width: 300 }}
                  margin="normal"
                  required
                  options={COUNTRIES}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
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
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  form='signUpForm'
                >
                  Submit
                </Button>
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
