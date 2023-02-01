import { useRef } from 'react'
import List from '@mui/material/List'
import { Reply, setReply } from '@/store/slices/chat-room'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import Bubble from '@/components/bubble'

const ChatScroll = () => {
  const dispatch = useAppDispatch()

  const chatDoc = useAppSelector((state) => state.chatRoomState.chatDoc)
  const bubblesRefs = useRef<Record<string, HTMLLIElement | null>>({})

  const handleMoveToReply = (reply: Reply) => {
    bubblesRefs.current[reply.messageId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <List
      sx={{
        pr: 4,
        pl: 1,
        height: '36rem',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse'
      }}
    >
      {chatDoc.messages?.map((message) => (
        <Bubble
          key={message.id}
          ref={(bubble) => (bubblesRefs.current[message.id] = bubble)}
          message={message}
          onReply={(reply) => dispatch(setReply(reply))}
          onMoveToReply={(reply) => handleMoveToReply(reply)}
        />
      ))}
    </List>
  )
}

export default ChatScroll
