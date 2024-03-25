import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function GroupChatView() {
  const chatMessages = ['Hello', 'Hi', 'How are you?']; // Replace with actual chat data

  return (
    <Card sx={{paddingBottom:2}}>
      <CardHeader title="Group Chat" subheader="Chat History" sx={{mb:2}} />
      <Container>
        <List>
          {chatMessages.map((message, index) => (
            <ListItem key={index}>{message}</ListItem>
          ))}
        </List>
        <TextField sx={{ mb: 2 }} label="Type a message" variant="outlined" fullWidth />
        <Button variant="contained">Send</Button>
      </Container>
    </Card>
  );
}
