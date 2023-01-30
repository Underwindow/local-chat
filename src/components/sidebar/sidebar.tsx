import React, { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import AddIcon from '@mui/icons-material/Add'
import * as Automerge from '@automerge/automerge'
import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { setActiveRoom } from '@/store/slices/session'
import { ChatRoom, ChatsDoc, setChats } from '@/store/slices/chats'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { updateDoc } from '@/utils/automerge'
import Room from '@/components/room'

interface Props {
  width: number
}

const Sidebar: React.FC<Props> = ({ width }) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.sessionState.user)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)
  const chatRooms = useAppSelector((state) => state.chatsState.chats)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffect(() => {
    setChannel(new BroadcastChannel(__CHATS_LS__))

    return () => channel?.close()
  }, [])

  useEffect(() => {
    if (channel) {
      channel.onmessage = onMessageListener
    }
    return () => channel?.removeEventListener('message', onMessageListener)
  }, [channel])

  const onMessageListener = (ev: MessageEvent) => {
    const newRooms = Automerge.merge<ChatsDoc>(
      Automerge.load(ev.data),
      chatRooms
    )
    dispatch(setChats(newRooms))
  }

  function handleCreateRoomClick(): void {
    if (!channel) return

    const newChats = Automerge.change<ChatsDoc>(
      chatRooms,
      'Add Room',
      (currChats) => {
        if (!currChats.chatRooms) currChats.chatRooms = []

        currChats.chatRooms.push({
          title: faker.company.bsNoun(),
          id: nanoid(6)
        })
      }
    )

    updateDoc(newChats, channel)
    dispatch(setChats(newChats))
  }

  function handleEntryRoom(room: ChatRoom) {
    dispatch(setActiveRoom(room))
  }

  function handleDeleteRoom(id: string): void {
    if (!channel) return

    const newChatRooms = Automerge.change<ChatsDoc>(
      chatRooms,
      'Delete Room',
      (currChats) => {
        const itemImdex = currChats.chatRooms.findIndex(
          (room) => room.id === id
        )

        currChats.chatRooms.splice(itemImdex, 1)
      }
    )

    updateDoc(newChatRooms, channel)
    dispatch(setChats(newChatRooms))
  }

  return (
    <Drawer
      sx={{
        width: width,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box'
        }
      }}
      variant='permanent'
      anchor='right'
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1]
        }}
      >
        <Button onClick={() => handleCreateRoomClick()}>
          <AddIcon />
        </Button>
      </Toolbar>
      <Divider />
      {user && (
        <List component='nav'>
          <React.Fragment>
            {chatRooms.chatRooms &&
              chatRooms.chatRooms.map((room) => (
                <Room
                  key={room.id}
                  onEntry={() => handleEntryRoom(room)}
                  onDelete={() => handleDeleteRoom(room.id)}
                  isSelected={activeRoom?.id === room.id}
                >
                  {room.title}
                </Room>
              ))}
          </React.Fragment>
        </List>
      )}
    </Drawer>
  )
}

export default Sidebar
