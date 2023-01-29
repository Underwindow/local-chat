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
import { Fragment, useEffect, useState } from 'react'
import './chat.scss'
import SendIcon from '@mui/icons-material/Send'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import Bubble from '@/components/bubble'
import * as Automerge from '@automerge/automerge'
import { ChatRoom } from '@/store/slices/chats'
import { ChatRoomDoc, setChatRoom } from '@/store/slices/chat-room'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { nanoid } from 'nanoid'
import { loadDoc, updateDoc } from '@/utils/automerge'
import dateFormat from '@/utils/dateFormat'
import { localStorageJSON } from '@/utils/storage'
import IconFileUpload from '@/components/icon-file-upload'
import uploadImage from '@/utils/uploadImage'

type Props = {
  username: string
  roomData: ChatRoom
}

const Chat: React.FC<Props> = ({ ...props }) => {
  const ENTER_KEY_CODE = 'Enter'

  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.sessionState.user)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)
  const chatRoom = useAppSelector((state) => state.chatRoomState.chatRoom)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffect(() => {
    console.log('activeRoom useEffect', props.roomData.id)
    setChannel(new BroadcastChannel(props.roomData.id))

    loadDoc<ChatRoomDoc>(localStorageJSON, activeRoom!.id, (doc) =>
      dispatch(setChatRoom(doc))
    )
  }, [activeRoom])

  useEffect(() => {
    if (channel) {
      console.log('channel onmessage sub', props.roomData.id)
      channel.onmessage = onMessageListener
    }

    return () => {
      console.log('channel close', props.roomData.id)
      channel?.removeEventListener('message', onMessageListener)
      channel?.close()
    }
  }, [channel])

  const onMessageListener = (ev: MessageEvent) => {
    const newChatRoom = Automerge.merge<ChatRoomDoc>(
      Automerge.load(ev.data),
      chatRoom
    )

    console.log('onmessage', newChatRoom)
    dispatch(setChatRoom(newChatRoom))
  }

  const [message, setMessage] = useState('')
  const [msgImage, setMsgImage] = useState<string | null>(null)

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value)
  }

  const handleMsgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(event).then((image) => {
      if (image.base64) {
        setMsgImage(image.base64 as string)
      }
    })
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (!channel) return

    if (message !== '' || msgImage !== null) {
      const newChatRoom = Automerge.change<ChatRoomDoc>(
        chatRoom,
        'Send Message',
        (currChatRoom) => {
          if (!currChatRoom.messages) currChatRoom.messages = []

          currChatRoom.messages.unshift({
            id: nanoid(6),
            user: user!,
            contents: {
              text: message,
              image: msgImage,
              quote: null
            },
            date: dateFormat(new Date())
          })
        }
      )

      updateDoc(newChatRoom, channel)
      dispatch(setChatRoom(newChatRoom))
      setMessage('')
      setMsgImage(null)
      console.log('Send!')
    }
  }

  const listChatMessages = chatRoom.messages?.map((message) => {
    const sender = user?.id === message.user.id ? 'Me' : message.user.name

    return (
      <Bubble key={message.id} date={message.date} src={message.contents.image}>
        {`${sender}: ${message.contents.text}`}
      </Bubble>
    )
  })

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
                <IconFileUpload
                  accept='image/png, image/jpeg'
                  onChange={handleMsgImageChange}
                />
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
                  disabled={message === '' && msgImage === null}
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
