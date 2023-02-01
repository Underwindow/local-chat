import { Fragment, useEffect, useState } from 'react'
import * as Automerge from '@automerge/automerge'
import { nanoid } from 'nanoid'
import { ChatMessage, ChatDoc, setChatRoom } from '@/store/slices/chat-room'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import dateFormat from '@/utils/dateFormat'
import { loadDoc, updateDoc } from '@/utils/automerge'
import { ResolvedImage } from '@/utils/uploadImage'
import { localStorageJSON } from '@/utils/storage'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import User from '@/model/user'
import ChatInput from '@/components/chat-input'
import { MessageData } from '@/components/chat-input/chat-input'
import ChatScroll from '@/components/chat-scroll'

interface Props {
  user: User
}

const Chat: React.FC<Props> = ({ ...props }) => {
  const { user } = props

  const dispatch = useAppDispatch()
  const chatDoc = useAppSelector((state) => state.chatRoomState.chatDoc)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)

  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffect(() => {
    if (!activeRoom) return

    setChannel(new BroadcastChannel(activeRoom.id))

    loadDoc<ChatDoc>(localStorageJSON, activeRoom.id, (doc) =>
      dispatch(setChatRoom(doc))
    )
  }, [activeRoom])

  useEffect(() => {
    if (channel) channel.onmessage = onMessageListener

    return () => {
      channel?.removeEventListener('message', onMessageListener)
      channel?.close()
    }
  }, [channel])

  const onMessageListener = (ev: MessageEvent) => {
    const newChatRoom = Automerge.merge<ChatDoc>(
      Automerge.load(ev.data),
      chatDoc
    )

    dispatch(setChatRoom(newChatRoom))
  }

  const storeImage = (image: ResolvedImage) => {
    const imageId = nanoid(8)
    localStorageJSON.setItem<string>(imageId, image.base64 as string)
    return { imageId }
  }

  const sendMessage = (msgData: MessageData) => {
    console.log('channel.current?.name', channel?.name)

    if (!channel) return

    const newChatMessage: ChatMessage = {
      id: nanoid(8),
      user: user,
      contents: {
        text: msgData.text ?? '',
        imageId: msgData.image ? storeImage(msgData.image).imageId : null,
        reply: msgData.reply
      },
      date: dateFormat(new Date())
    }

    const newChatRoom = Automerge.change<ChatDoc>(
      chatDoc,
      'Send Message',
      (currChatRoom) => {
        if (!currChatRoom.messages) currChatRoom.messages = []

        currChatRoom.messages.unshift(newChatMessage)
      }
    )

    updateDoc(newChatRoom, channel)
    dispatch(setChatRoom(newChatRoom))
  }

  const roomTitle = `Room: ${activeRoom?.title}`

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
              <Grid id='chat-window' sx={{height: '38rem'}} xs={12} item>
                <ChatScroll />
              </Grid>
              <Grid xs={12} item>
                <Grid container>
                  <Grid xs={12} item>
                    <ChatInput onSendMessage={(data) => sendMessage(data)} />
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
