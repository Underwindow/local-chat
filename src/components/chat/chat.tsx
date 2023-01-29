import {
  AppBar,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  List,
  Paper,
  TextField,
  Toolbar,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'
import { FormEvent, Fragment, useEffect, useState } from 'react'
import './chat.scss'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import Bubble from '@/components/bubble'
import * as Automerge from '@automerge/automerge'
import { ChatRoom } from '@/store/slices/chats'
import { ChatRoomDoc, Reply, setChatRoom } from '@/store/slices/chat-room'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { nanoid } from 'nanoid'
import { loadDoc, updateDoc } from '@/utils/automerge'
import dateFormat from '@/utils/dateFormat'
import { localStorageJSON } from '@/utils/storage'
import IconFileUpload from '@/components/icon-file-upload'
import uploadImage, { ResolvedImage } from '@/utils/uploadImage'

type Props = {
  username: string
  roomData: ChatRoom
}

const ENTER_KEY_CODE = 'Enter'

const Chat: React.FC<Props> = ({ ...props }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.sessionState.user)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)
  const chatRoom = useAppSelector((state) => state.chatRoomState.chatRoom)

  const [channel, setChannel] = useState<BroadcastChannel | null>(null)
  const [message, setMessage] = useState('')
  const [msgImage, setMsgImage] = useState<ResolvedImage | null>(null)
  const [reply, setReply] = useState<Reply | null>(null)

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

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value)
  }

  const handleMsgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(event).then((image) => setMsgImage(image))
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (!channel) return
    if (message !== '' || msgImage !== null) {
      console.log('here')

      const newChatRoom = Automerge.change<ChatRoomDoc>(
        chatRoom,
        'Send Message',
        (currChatRoom) => {
          if (!currChatRoom.messages) currChatRoom.messages = []
          console.log('reply message', reply, message)

          currChatRoom.messages.unshift({
            id: nanoid(6),
            user: user!,
            contents: {
              text: message,
              image: (msgImage?.base64 as string) ?? null,
              reply: reply
            },
            date: dateFormat(new Date())
          })
        }
      )

      updateDoc(newChatRoom, channel)
      dispatch(setChatRoom(newChatRoom))
      setMessage('')
      setReply(null)
      setMsgImage(null)
      console.log('Sent!')
    }
  }

  const listChatMessages = chatRoom.messages?.map((message) => (
    <Bubble
      id={message.id}
      key={message.id}
      message={message}
      onReply={(reply) => setReply(reply)}
      onMoveToReply={(reply) => {
        const replyEl = document.getElementById(reply.messageId)
        replyEl?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }}
    />
  ))

  function handleFormSubmit(event: FormEvent<HTMLDivElement>): void {
    event.preventDefault()
    console.log('handleFormSubmit', event.currentTarget.nodeValue)
  }

  return (
    <Fragment>
      <Container>
        <Paper elevation={2}>
          <Box p={3}>
            <Typography variant='h4' gutterBottom>
              Room: {props.roomData.title}
            </Typography>
            <Divider />
            <FormControl fullWidth onSubmit={handleFormSubmit}>
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
                <Grid
                  sx={{ position: 'relative' }}
                  style={{ paddingLeft: 0 }}
                  xs={10}
                  item
                >
                  {reply && (
                    <Box
                      id='reply-window'
                      sx={{
                        backgroundColor: 'white'
                      }}
                    >
                      <AppBar position='relative' color='transparent'>
                        <Toolbar>
                          <Typography
                            variant='h6'
                            component='div'
                            overflow='hidden'
                            noWrap
                          >
                            Replay to: {reply?.username}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }} />
                          <IconButton onClick={() => setReply(null)}>
                            <CloseIcon />
                          </IconButton>
                        </Toolbar>
                      </AppBar>
                    </Box>
                  )}

                  <TextField
                    fullWidth
                    onChange={handleMessageChange}
                    onKeyDown={(e) => handleEnterKey(e)}
                    value={message}
                    label='Type your message...'
                    helperText={msgImage?.fileName}
                    variant='outlined'
                  />
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
            </FormControl>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  )
}

export default Chat
