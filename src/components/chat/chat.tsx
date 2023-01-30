import { Fragment, useEffect, useState } from 'react'
import './chat.scss'
import * as Automerge from '@automerge/automerge'
import { nanoid } from 'nanoid'
import { ChatRoom } from '@/store/slices/chats'
import { ChatRoomDoc, Reply, setChatRoom } from '@/store/slices/chat-room'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import dateFormat from '@/utils/dateFormat'
import { loadDoc, updateDoc } from '@/utils/automerge'
import uploadImage, { ResolvedImage } from '@/utils/uploadImage'
import { localStorageJSON } from '@/utils/storage'
import Bubble from '@/components/bubble'
import IconFileUpload from '@/components/icon-file-upload'
import ReplyBox from '@/components/reply-box'
import List from '@mui/material/List'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'

interface Props {
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
  const [msgText, setMsgText] = useState('')
  const [msgImage, setMsgImage] = useState<ResolvedImage | null>(null)
  const [reply, setReply] = useState<Reply | null>(null)

  useEffect(() => {
    setChannel(new BroadcastChannel(props.roomData.id))

    loadDoc<ChatRoomDoc>(localStorageJSON, activeRoom!.id, (doc) =>
      dispatch(setChatRoom(doc))
    )
  }, [activeRoom])

  useEffect(() => {
    if (channel) {
      channel.onmessage = onMessageListener
    }

    return () => {
      channel?.removeEventListener('message', onMessageListener)
      channel?.close()
    }
  }, [channel])

  const onMessageListener = (ev: MessageEvent) => {
    const newChatRoom = Automerge.merge<ChatRoomDoc>(
      Automerge.load(ev.data),
      chatRoom
    )

    dispatch(setChatRoom(newChatRoom))
  }

  const handleMsgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(event).then((image) => setMsgImage(image))
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const storeImage = (base64: string): string => {
    const imageId = nanoid(8)
    localStorageJSON.setItem<string>(imageId, base64)
    return imageId
  }

  const sendMessage = () => {
    if (!channel) return
    if (msgText !== '' || msgImage !== null) {
      const newChatRoom = Automerge.change<ChatRoomDoc>(
        chatRoom,
        'Send Message',
        (currChatRoom) => {
          if (!currChatRoom.messages) currChatRoom.messages = []

          currChatRoom.messages.unshift({
            id: nanoid(8),
            user: user!,
            contents: {
              text: msgText,
              imageId: msgImage ? storeImage(msgImage.base64 as string) : null,
              reply: reply
            },
            date: dateFormat(new Date())
          })
        }
      )

      updateDoc(newChatRoom, channel)
      dispatch(setChatRoom(newChatRoom))
      setMsgText('')
      setReply(null)
      setMsgImage(null)
    }
  }

  const roomTitle = `Room: ${props.roomData.title}`

  const listChatMessages = (
    <List id='chat-window-messages'>
      {chatRoom.messages?.map((message) => (
        <Bubble
          key={message.id}
          id={message.id}
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
      ))}
    </List>
  )

  return (
    <Fragment>
      <Container>
        <Paper elevation={2}>
          <Box p={3}>
            <Typography variant='h4' gutterBottom>
              {roomTitle}
            </Typography>
            <Divider />
            <Grid container spacing={4} alignItems='center'>
              <Grid id='chat-window' xs={12} item>
                {listChatMessages}
              </Grid>
              <Grid xs={12} item>
                <Grid container>
                  <Grid xs={12} item>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}
                    >
                      <IconFileUpload
                        accept='image/png, image/jpeg'
                        onChange={handleMsgImageChange}
                      />
                      <Box
                        sx={{ position: 'relative', flexGrow: '1' }}
                        style={{ paddingLeft: 0 }}
                      >
                        {reply && (
                          <ReplyBox onClose={() => setReply(null)}>
                            {reply.username}
                          </ReplyBox>
                        )}
                        <TextField
                          inputRef={(input) => input && reply && input.focus()}
                          fullWidth
                          onChange={(e) => setMsgText(e.target.value)}
                          onKeyDown={(e) => handleEnterKey(e)}
                          value={msgText}
                          label='Type your message...'
                          helperText={msgImage?.fileName}
                          variant='outlined'
                        />
                      </Box>
                      <IconButton
                        onClick={sendMessage}
                        aria-label='send'
                        color='primary'
                        disabled={msgText === '' && msgImage === null}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Fragment>
  )
}

export default Chat
