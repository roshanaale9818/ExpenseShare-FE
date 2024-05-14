import { useNavigate } from 'react-router-dom';

import  Grid  from '@mui/material/Grid';
import  Paper  from '@mui/material/Paper';
import  Button  from '@mui/material/Button';
import  Typography  from '@mui/material/Typography';

import ThemeProvider from 'src/theme';

// import ThemeProvider from 'src/theme';

export default function HomeView() {
  const navigate = useNavigate();
  const onSignUpHandler = ()=>{
      navigate('/signup');
  }
  return (
    <ThemeProvider>
    <Grid container>
      <Grid item xs={12}>
        <Paper
          className="main-banner-content"
          elevation={4} // Set the elevation for a shadow effect (optional)
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '600px', // For a 16:9 aspect ratio
            padding: 0, // Set padding
          }}
        >
          <img
            src="assets/images/account.jpg"
            alt="desc"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // To maintain aspect ratio and cover the container
            }}
          />

          <Grid item>
            <div
              className="main-banner-content"
              style={{
                position: 'absolute',
                top: 'calc(50%-84px)',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white', // Text color
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  backgroundColor: 'primary',
                  padding: '3',
                }}
              >
                Less Stress When Sharing Expenses
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Keep track of your shared expenses and balances with housemates, trips, groups,
                friends, and family.
              </Typography>
              <Button onClick={onSignUpHandler} variant="contained" color="primary" size="large" sx={{ margin: 2 }}>
                Sign up
              </Button>
              <Button variant="outlined" color="primary" size="large" sx={{ margin: 2 }}>
                Learn More
              </Button>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
    </ThemeProvider>
  );
}
