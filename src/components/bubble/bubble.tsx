import { HTMLAttributes, forwardRef } from 'react'
import styles from './bubble.module.scss'
import ReplyIcon from '@mui/icons-material/Reply'
import { ChatMessage, Reply } from '@/store/slices/chat-room'
import { useAppSelector } from '@/utils/redux'
import { localStorageJSON } from '@/utils/storage'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

interface Props extends HTMLAttributes<HTMLLIElement> {
  message: ChatMessage
  onReply: (reply: Reply) => void
  onMoveToReply: (reply: Reply) => void
}

const Bubble = forwardRef<HTMLLIElement, Props>(
  ({ message, onReply, onMoveToReply }, ref) => {
    const user = useAppSelector((state) => state.sessionState.user)

    const handleReply = () => {
      onReply({
        messageId: message.id,
        username: message.user.name,
        text: message.contents.text
      })
    }

    const reply = message.contents.reply
    const imageId = message.contents.imageId
    const image = imageId ? localStorageJSON.getItem<string>(imageId) : null

    const replyButton = (
      <Box className={styles['bubble__reply-button']} sx={{ display: 'flex' }}>
        <IconButton
          color='primary'
          edge='end'
          aria-label='reply'
          onClick={() => handleReply()}
        >
          <ReplyIcon />
        </IconButton>
      </Box>
    )

    const sender = `${user?.id === message.user.id ? 'Me' : message.user.name}:`
    const messageText = (
      <div className={styles.bubble__text}>{!reply && sender} {message.contents.text}</div>
    )

    const messageReply = (reply: Reply) => (
      <div
        className={styles.bubble__reply}
        onClick={() => onMoveToReply(reply)}
      >
        {`${reply.username}: ${reply.text}`}
      </div>
    )

    const messageImage = (image: string) => (
      <img className={styles.bubble__image} src={image} alt='messgae_image' />
    )

    const messageContent = (
      <>
        {reply && sender}
        {reply && messageReply(reply)}
        <div className={styles.bubble__content} onClick={() => handleReply()}>
          {messageText}
          {image && (
            <List sx={{ padding: 0 }}>
              <ListItem sx={{ pl: 0, py: 0 }}>
                <ListItemText secondary={messageImage(image)} />
              </ListItem>
            </List>
          )}
        </div>
      </>
    )

    return (
      <ListItem
        ref={ref}
        className={styles.bubble}
        secondaryAction={replyButton}
      >
        <ListItemText primary={messageContent} secondary={message.date} />
      </ListItem>
    )
  }
)

export default Bubble
