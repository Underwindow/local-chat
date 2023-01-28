import { faker } from '@faker-js/faker'
import { Drawer, Toolbar, Button, Divider, List } from '@mui/material'
import { nanoid } from 'nanoid'
import React, { useEffect, useState } from 'react'
import RoomDTO from '@/model/room'
import Room from '@/components/room'
import AddIcon from '@mui/icons-material/Add'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { setActiveRoom, setChats } from '@/store/slices/session'
import * as Automerge from '@automerge/automerge'
import useEffectOnce from '@/utils/useEffectOnce'
import { ChatsDoc } from '@/model/doc'
import { updateDoc } from '@/utils/automerge'

type Props = {
  width: number
}

const Sidebar: React.FC<Props> = ({ width }) => {
  const dispatch = useAppDispatch()
  const activeRoom = useAppSelector((state) => state.session.activeRoom)
  const chats = useAppSelector((state) => state.session.chats)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffectOnce(() => {
    setChannel(new BroadcastChannel('chats'))

    return () => {
      console.log('channel close')
      channel?.close()
    }
  })

  useEffect(() => {
    if (channel) {
      channel.onmessage = onMessageListener
    }
    return () => {
      channel?.removeEventListener('message', onMessageListener)
    }
  }, [channel])

  const onMessageListener = (ev: MessageEvent) => {
    const newChats = Automerge.merge<ChatsDoc>(Automerge.load(ev.data), chats)
    console.log('onmessage', newChats)
    dispatch(setChats(newChats))
  }

  function handleCreateRoomClick(): void {
    if (!channel) return

    const newChats = Automerge.change<ChatsDoc>(
      chats,
      'Add chat',
      (currChats) => {
        if (!currChats.chats) currChats.chats = []

        currChats.chats.push({ title: faker.company.bsNoun(), id: nanoid(6) })
      }
    )

    updateDoc(newChats, channel)
    dispatch(setChats(newChats))
  }

  function handleEntryRoom(room: RoomDTO) {
    console.log('EntryRoomClicked', room.id)
    dispatch(setActiveRoom(room))
  }

  function handleDeleteRoom(id: string): void {
    if (!channel) return

    const newChats = Automerge.change<ChatsDoc>(
      chats,
      'Delete chat',
      (currChats) => {
        const itemImdex = currChats.chats.findIndex((chat) => chat.id === id)
        if (itemImdex !== -1) {
          currChats.chats.splice(itemImdex, 1)
        }
      }
    )

    updateDoc(newChats, channel)
    dispatch(setChats(newChats))
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
      <List component='nav'>
        <React.Fragment>
          {chats?.chats &&
            chats.chats.map((chats) => (
              <Room
                key={chats.id}
                onEntry={() => handleEntryRoom(chats)}
                onDelete={() => handleDeleteRoom(chats.id)}
                isSelected={activeRoom?.id === chats.id}
              >
                {chats.title}
              </Room>
            ))}
        </React.Fragment>
      </List>
    </Drawer>
  )
}

export default Sidebar
