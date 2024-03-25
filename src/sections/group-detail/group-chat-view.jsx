import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function GroupChatView() {
  const chatMessages = ['Hello', 'Hi', 'How are you?']; // Replace with actual chat data

  return (
    <Paper>
      <List>
        {chatMessages.map((message, index) => (
          <ListItem key={index}>{message}</ListItem>
        ))}
      </List>
      <TextField label="Type a message" variant="outlined" fullWidth />
      <Button variant="contained">Send</Button>
    </Paper>
  );
}
