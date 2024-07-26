import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Twitter, Facebook, Instagram } from '@mui/icons-material';

import CopyRight from 'src/components/copyright/CopyRight';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        p: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We are expense share company, dedicated to providing the best service to our
              customers.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sydney, NSW, Australia
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: expenseshare@gmail.com
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Phone: +1 234 567 8901
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Link
              href="https://www.facebook.com/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook />
            </Link>
            <Link
              href="https://www.instagram.com/"
              color="inherit"
              sx={{ pl: 1, pr: 1 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram />
            </Link>
            <Link
              href="https://www.twitter.com/"
              color="inherit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter />
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <CopyRight />
        </Box>
      </Container>
    </Box>
  );
}
