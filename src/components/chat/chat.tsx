import {
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { Fragment, useEffect, useRef, useState } from 'react'
import './chat.scss'
import SendIcon from '@mui/icons-material/Send'
import useEffectOnce from '@/utils/useEffectOnce'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import Bubble from '@/components/bubble'
import * as Automerge from '@automerge/automerge'
// import { ChatsDoc } from '@/store/slices/chats/chats-doc.model';
import { ChatRoom } from '@/store/slices/chats';
import { ChatMessage } from '@/store/slices/chat-room';

type Props = {
  username: string
  roomData: ChatRoom
}

const Chat: React.FC<Props> = ({ ...props }) => {
  const ENTER_KEY_CODE = 'Enter'

  const webSocket = useRef<WebSocket>(new WebSocket('ws://localhost:8080/chat'))
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
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
      const chatMessageDto = JSON.parse(event.data) as ChatMessage
      console.log('Message:', chatMessageDto)
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessageDto.id,
          user: chatMessageDto.user,
          contents: chatMessageDto.contents
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
    if (event.key === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (message !== '') {
      // webSocket.current.send(
      //   JSON.stringify(new ChatMessage(props.username, message))
      // )
      // setMessage('')
      
      // const newChats = Automerge.change<ChatsDoc>(
      //   chats,
      //   'Delete chat',
      //   (currChats) => {
      //     const itemImdex = currChats.chats.findIndex((chat) => chat.id === id)
      //     if (itemImdex !== -1) {
      //       currChats.chats.splice(itemImdex, 1)
      //     }
      //   }
      // )
  
      // updateDoc(newChats, channel)

      console.log('Send!')
    }
  }

  const listChatMessages = chatMessages.map((chatMessageDto) => (
    <Bubble key={chatMessageDto.id}>
      {`${chatMessageDto.user}: ${chatMessageDto.contents.text}`}
    </Bubble>
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
                <List id='chat-window-messages'>{listChatMessages}</List>
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
