import React, { HTMLAttributes } from 'react'
import styles from './bubble.module.scss'
import ReplyIcon from '@mui/icons-material/Reply'
import { ChatMessage, Reply } from '@/store/slices/chat-room'
import { useAppSelector } from '@/utils/redux'
import { localStorageJSON } from '@/utils/storage';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface Props extends HTMLAttributes<HTMLUListElement> {
  message: ChatMessage
  onReply: (reply: Reply) => void
  onMoveToReply: (reply: Reply) => void
}

const Bubble: React.FC<Props> = ({
  message,
  onReply,
  onMoveToReply,
  ...props
}) => {
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
    <Box sx={{ display: 'flex' }}>
      <IconButton edge='end' aria-label='reply' onClick={() => handleReply()}>
        <ReplyIcon />
      </IconButton>
    </Box>
  )

  const sender = user?.id === message.user.id ? 'Me' : message.user.name
  const messageText = `${sender}: ${message.contents.text}`

  const messageReply = (reply: Reply) => (
    <span className={styles.bubble__reply} onClick={() => onMoveToReply(reply)}>
      {`Reply to ${reply.username}: ${reply.text}`}
    </span>
  )

  const messageImage = (image: string) => (
    <img className={styles.bubble__image} src={image} alt='messgae_image' />
  )

  const messageContent = (
    <>
      {messageText}
      {(imageId || reply) && (
        <List sx={{ padding: 0 }}>
          <ListItem sx={{ padding: 0 }}>
            <ListItemText
              secondary={
                <>
                  {reply && messageReply(reply)}
                  {image && messageImage(image)}
                </>
              }
            />
          </ListItem>
        </List>
      )}
    </>
  )

  return (
    <ListItem
      id={props.id}
      className={styles.bubble}
      secondaryAction={replyButton}
    >
      <ListItemText
        primary={messageContent}
        secondary={message.date}
      />
    </ListItem>
  )
}

export default Bubble
