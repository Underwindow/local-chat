import {
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { Fragment, useEffect, useRef, useState } from 'react'
import './chat.scss'
import SendIcon from '@mui/icons-material/Send'
import useEffectOnce from '@/utils/useEffectOnce'
import RoomDTO from '@/model/room'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatMessageDTO from '@/model/chat-message';

type Props = {
  username: string
  roomData: RoomDTO
}

const Chat: React.FC<Props> = ({ ...props }) => {
  const ENTER_KEY_CODE = 13

  const webSocket = useRef<WebSocket>(new WebSocket('ws://localhost:8080/chat'))
  const [chatMessages, setChatMessages] = useState<ChatMessageDTO[]>([])
  const [message, setMessage] = useState('')

  useEffectOnce(() => {
    console.log('Opening WebSocket')

    webSocket.current.onopen = (event) => {
      console.log('Open:', event)
    }
    webSocket.current.onclose = (event) => {
      console.log('Close:', event)
    }

    return () => {
      console.log('here')

      webSocket.current.close()
    }
  })

  useEffect(() => {
    webSocket.current.onmessage = (event) => {
      const chatMessageDto = JSON.parse(event.data) as ChatMessageDTO
      console.log('Message:', chatMessageDto)
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessageDto.id,
          user: chatMessageDto.user,
          message: chatMessageDto.message
        }
      ])
    }
  }, [chatMessages])

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value)
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.keyCode === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (message !== '') {
      console.log('Send!')
      webSocket.current.send(
        JSON.stringify(new ChatMessageDTO(props.username, message))
      )
      setMessage('')
    }
  }

  const listChatMessages = chatMessages.map((chatMessageDto) => (
    <ListItem key={chatMessageDto.id}>
      <ListItemText
        primary={`${chatMessageDto.user}: ${chatMessageDto.message}`}
      />
    </ListItem>
  ))

  return (
    <Fragment>
      <Container>
        <Paper elevation={2}>
          <Box p={3}>
            <Typography variant='h4' gutterBottom>
              Room: {props.roomData.title} {props.roomData.id}
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems='center'>
              <Grid id='chat-window' xs={12} item>
                <List id='chat-window-messages'>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`sdsdssdsdsd`}
                      secondary={'sdsdds'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`sdsdssdsdsd`}
                      secondary={'sdsdds'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`sdsdssdsdsd`}
                      secondary={'sdsdds'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={`sdsdssdsdsd`}
                      secondary={'sdsdds'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary={`sdsdssdsdsd`} />
                  </ListItem>
                  {listChatMessages}
                </List>
              </Grid>
              <Grid xs={1} item>
                <IconButton
                  onClick={sendMessage}
                  aria-label='attach'
                  color='primary'
                >
                  <AttachFileIcon />
                </IconButton>
              </Grid>
              <Grid xs={10} item>
                <FormControl fullWidth>
                  <TextField
                    onChange={handleMessageChange}
                    onKeyDown={(e) => handleEnterKey(e)}
                    value={message}
                    label='Type your message...'
                    variant='outlined'
                    required
                  />
                </FormControl>
              </Grid>
              <Grid xs={1} item>
                <IconButton
                  onClick={sendMessage}
                  aria-label='send'
                  color='primary'
                  disabled={message === ''}
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  )
}

export default Chat
