import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
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






const defaultTheme = createTheme();

export default function SignUpView() {
    // const dispatch = useDispatch();
    // const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
    console.log("LOGGED IN STATUS", isLoggedIn)
    const loginHandler = () => {
        // console.log("submitting")
        // dispatch(authActions.login())
        // navigate('/auth');
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
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
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            {/* <LockOutlinedIcon /> */}
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign Up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    autoComplete="current-password"
                                    InputProps={
                                        {
                                            endAdornment:
                                                <InputAdornment position="end">
                                                  <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                  >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                  </IconButton>
                                                </InputAdornment>
                                              }
                                        }
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
                                name="address"
                                label="Address"
                                type="text"
                                id="address"
                                autoComplete="address"
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

                            <Button onClick={loginHandler}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Submit
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link to='/login' variant="body2">
                                        Back to Login
                                    </Link>
                                </Grid>
                                {/* <Grid item>
                  <Link to='' href="#" variant="body2">
                    Dont have an account? Sign Up
                  </Link>
                </Grid> */}
                            </Grid>
                            <CopyRight sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}