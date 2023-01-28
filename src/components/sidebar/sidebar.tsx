import { faker } from '@faker-js/faker'
import { Drawer, Toolbar, Button, Divider, List } from '@mui/material'
import { nanoid } from 'nanoid'
import React, { useState } from 'react'
import { localStorage } from '@/utils/storage'
import RoomDTO from '@/model/room'
import Room from '@/components/room'
import AddIcon from '@mui/icons-material/Add'
import { useAppDispatch, useAppSelector } from '@/utils/redux';
import { setActiveRoom } from '@/store/slices/session';

type Props = {
  width: number
}

const Sidebar: React.FC<Props> = ({ width }) => {
  const dispatch = useAppDispatch()
  const activeRoom = useAppSelector((state) => state.session.activeRoom)

  const [rooms, setRooms] = useState<RoomDTO[]>(
    localStorage.getItem('rooms') ?? []
  )

  function handleCreateRoomClick(): void {
    setRooms(() => {
      const newRooms = [
        ...rooms,
        { title: faker.company.bsNoun(), id: nanoid(6) }
      ]

      localStorage.setItem<RoomDTO[]>('rooms', newRooms)
      return newRooms
    })
  }

  function handleEntryRoom(room: RoomDTO) {
    console.log('EntryRoomClicked', room.id)
    dispatch(setActiveRoom(room))
  }

  function handleDeleteRoom(id: string): void {
    setRooms(() => {
      const newRooms = rooms.filter((room) => room.id !== id)

      localStorage.setItem<RoomDTO[]>('rooms', newRooms)
      return newRooms
    })
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
          {rooms.map((room) => (
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
    </Drawer>
  )
}

export default Sidebar
