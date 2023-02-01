import Box from '@mui/material/Box'
import React, { useState } from 'react'
import ReplyBox from '@/components/reply-box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send'
import { Reply, setReply } from '@/store/slices/chat-room'
import uploadImage, { ResolvedImage } from '@/utils/uploadImage'
import { useAppDispatch, useAppSelector } from '@/utils/redux';
import IconFileUpload from '@/components/icon-file-upload'

const ENTER_KEY_CODE = 'Enter'
const MAX_IMG_SIZE_MB = 2

export interface MessageData {
  text: string
  image: ResolvedImage | null
  reply: Reply | null
}

interface Props {
  onSendMessage: (msgData: MessageData) => void
}

const ChatInput: React.FC<Props> = ({ ...props }) => {
  const dispatch = useAppDispatch()

  const reply = useAppSelector((state) => state.chatRoomState.reply)

  const { onSendMessage } = props

  const [msgText, setMsgText] = useState<string>('')
  const [msgImage, setMsgImage] = useState<ResolvedImage | null>(null)
  const [msgError, setMsgError] = useState<string | null>(null)

  const getMsgData = (): MessageData => ({
    text: msgText,
    image: msgImage,
    reply: reply
  })

 
  const handleCloseReply = () => {
    dispatch(setReply(null))
  }

  const handleMsgImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files !== null) {
      uploadImage(files[0], MAX_IMG_SIZE_MB)
        .then((image) => {
          event.target.value = ''
          setMsgImage(image)
          setMsgError(null)
        })
        .catch(setMsgError)
    }
  }

  const handleEnterKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ENTER_KEY_CODE) {
      sendMessage()
    }
  }

  const handleSendBtnCLick = () => {
    sendMessage()
  }

  const sendMessage = () => {
    if (msgText === '' && msgImage === null) return

    onSendMessage(getMsgData())
    clearMessageData()
    dispatch(setReply(null))
  }

  const clearMessageData = () => {
    setMsgText('')
    setMsgImage(null)
    setMsgError(null)
  }

  return (
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
        onChange={(e) => handleMsgImageChange(e)}
      />
      <Box
        sx={{ position: 'relative', flexGrow: '1' }}
        style={{ paddingLeft: 0 }}
      >
        {reply && <ReplyBox onClose={() => handleCloseReply()}>{reply.username}</ReplyBox>}
        <TextField
          inputRef={(input) => reply && input?.focus()}
          onChange={(e) => setMsgText(e.target.value)}
          value={msgText}
          onKeyDown={(e) => handleEnterKey(e)}
          helperText={msgImage?.fileName || msgError || ''}
          label='Type your message...'
          fullWidth
          variant='outlined'
        />
      </Box>
      <IconButton
        onClick={() => handleSendBtnCLick()}
        aria-label='send'
        color='primary'
        disabled={msgText === '' && msgImage === null}
      >
        <SendIcon />
      </IconButton>
    </Box>
  )
}

export default ChatInput
