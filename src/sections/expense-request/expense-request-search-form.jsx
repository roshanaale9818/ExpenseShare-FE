import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useState } from 'react';
import Collapse from '@mui/material/Collapse';
import ExpandMoreIcon from '@mui/icons-material/Expand';

export default function ExpenseRequestSearchForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardContent>
        <Button
          sx={{ mb: 2 }}
          onClick={() => setOpen(!open)}
          endIcon={<ExpandMoreIcon />}
          variant="outlined"
          
        >
          {open ? 'Open Filter' : 'Show Filter'}
        </Button>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Container>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Expense Title"
                    name="expenseTitle"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value="group1"
                    select
                    label="Group"
                    name="group"
                    variant="outlined"
                  >
                    <MenuItem value="group1">Group 1</MenuItem>
                    <MenuItem value="group2">Group 2</MenuItem>
                    <MenuItem value="group3">Group 3</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value="pending"
                    select
                    label="Requested By"
                    name="paidBy"
                    variant="outlined"
                  >
                    <MenuItem value="pending">User1</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    value="Pending"
                    label="Status"
                    name="status"
                    variant="outlined"
                    aria-readonly
                    InputProps={{
                        readOnly: true,
                        disabled:true
                      }}
                  />
                </Grid>
              </Grid>
              <Button sx={{ mt: 2 }} type="submit" variant="contained" color="primary">
                Search
              </Button>
            </form>
          </Container>
        </Collapse>
      </CardContent>
    </Card>
  );
}
