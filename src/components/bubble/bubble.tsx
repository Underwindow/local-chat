import React, { HTMLAttributes } from 'react'
import { Box, IconButton, List, ListItem, ListItemText } from '@mui/material'
import styles from './bubble.module.scss'
import { ChatMessage, Reply } from '@/store/slices/chat-room'
import { useAppSelector } from '@/utils/redux'
import ReplyIcon from '@mui/icons-material/Reply'

type Props = {
  message: ChatMessage
  onReply: (reply: Reply) => void
  onMoveToReply: (reply: Reply) => void
} & HTMLAttributes<HTMLUListElement>

const Bubble: React.FC<Props> = ({
  message,
  onReply,
  onMoveToReply,
  ...props
}) => {
  const user = useAppSelector((state) => state.sessionState.user)

  const handleReply = (anchorEl: HTMLElement) => {
    onReply({
      messageId: message.id,
      username: message.user.name,
      text: message.contents.text
      // anchorEl
    })
  }

  const sender = user?.id === message.user.id ? 'Me' : message.user.name
  const reply = message.contents.reply
  const image = message.contents.image

  return (
    <ListItem
      id={props.id}
      className={styles.bubble}
      secondaryAction={
        <Box sx={{ display: 'flex' }}>
          <IconButton
            edge='end'
            aria-label='reply'
            onClick={(e) => handleReply(e.currentTarget)}
          >
            <ReplyIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemText
        primary={
          <>
            {`${sender}: ${message.contents.text}`}
            {(image || reply) && (
              <List sx={{ padding: 0 }}>
                <ListItem sx={{ padding: 0 }}>
                  <ListItemText
                    secondary={
                      <>
                        {reply && (
                          <span className={styles.bubble__reply} onClick={() => onMoveToReply(reply)}>
                            {`Reply to ${reply.username}: ${reply.text}`}
                          </span>
                        )}
                        {image && (
                          <img
                            className={styles.bubble__image}
                            src={image}
                            alt='messgae_image'
                          />
                        )}
                      </>
                    }
                  />
                </ListItem>
              </List>
            )}
          </>
        }
        secondary={message.date}
      />
    </ListItem>
  )
}

export default Bubble
