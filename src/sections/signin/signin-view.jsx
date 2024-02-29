import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// import { useLoaderData } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { authActions } from 'src/store';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';



import CopyRight from 'src/components/copyright/CopyRight';






const defaultTheme = createTheme();
// export async function loaderFunction(req,params){
//   console.log("THIS IS REQ AND PARAMS",req,params)
//   const res = await fetch('https://jsonplaceholder.typicode.com/todos');
//   console.log(res,"Loader is called");
//   return {data:res}
// }

export default function SignInView() {
const dispatch = useDispatch();
const navigate = useNavigate();
  // dispatchLoginAction(authActions.login())
  const   isLoggedIn = useSelector(state=>state.auth.isLoggedIn);
  console.log("LOGGED IN STATUS",isLoggedIn)
  // const onLogoutHandler = async ()=>{
  //   await dispatch(authActions.logout())
  // }
  const loginHandler = ()=>{
    console.log("submitting")
    dispatch(authActions.login())
    navigate('/auth');
  }






  // it will get the closest loader function 
  // const dataLoaded = useLoaderData();
  // we can use loader data inside all components of that component or all of its children 
  // console.log(dataLoaded);
  // we put loader function inside the file of the component 

  // useEffect(()=>{
  //   console.log("USE EFFECT IS CALLED");
  // }
  // ,[])

  // const navigation = useNavigation();
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
       {/* {navigation.state==='loading' &&<p>Loading....</p>} */}
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
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button onClick={loginHandler}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href='/404' variant="body2">
                  Back
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    Dont have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              <CopyRight sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}