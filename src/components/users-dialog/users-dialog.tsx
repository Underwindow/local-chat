import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import useEffectOnce from '@/utils/useEffectOnce'
import * as Automerge from '@automerge/automerge'
import { SharedUser, UsersDoc, setSharedUsers } from '@/store/slices/users'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { loadDoc, updateDoc } from '@/utils/automerge'
import { localStorageJSON, sessionStorageJSON } from '@/utils/storage'
import User from '@/model/user'
import { setUser } from '@/store/slices/session'

export interface Props {
  open: boolean
}

const UsersDialog: React.FC<Props> = ({ ...props }) => {
  const dispatch = useAppDispatch()

  const { open } = props

  const sharedUsers = useAppSelector((state) => state.usersState.sharedUsers)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffectOnce(() => {
    let userData = sessionStorageJSON.getItem<User>(__USER_SS__)
    if (userData !== null) {
      dispatch(setUser(userData))
    }

    loadDoc<UsersDoc>(localStorageJSON, __USERS_LS__, (doc) =>
      dispatch(setSharedUsers(doc))
    )

    setChannel(new BroadcastChannel(__USERS_LS__))

    return () => {
      console.log(`${__USERS_LS__} channel close`)
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
    const newSharedUsers = Automerge.merge<UsersDoc>(
      Automerge.load(ev.data),
      sharedUsers
    )
    console.log('onmessage', newSharedUsers)
    dispatch(setSharedUsers(newSharedUsers))
  }

  function handleListItemClick(sharedUser: SharedUser): void {
    if (!channel) return

    const newSharedUsers = Automerge.change<UsersDoc>(
      sharedUsers,
      'Add user',
      (currUsers) => {
        const id = currUsers.users.findIndex((user) => user.id === sharedUser.id)
        currUsers.users[id] = {
          id: sharedUser.id,
          name: sharedUser.name,
          isActive: true,
        }
      }
    )

    updateDoc(newSharedUsers, channel)
    dispatch(setSharedUsers(newSharedUsers))

    sessionStorageJSON.setItem<User>(__USER_SS__, sharedUser)
    dispatch(setUser(sharedUser))
  }

  function handleCreateUserClick(): void {
    if (!channel) return

    const newSharedUsers = Automerge.change<UsersDoc>(
      sharedUsers,
      'Add user',
      (currUsers) => {
        if (!currUsers.users) currUsers.users = []

        currUsers.users.push({
          name: faker.name.fullName(), 
          id: nanoid(8),
          isActive: false
        })
      }
    )

    updateDoc(newSharedUsers, channel)
    dispatch(setSharedUsers(newSharedUsers))
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Choose your account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {sharedUsers.users &&
          sharedUsers.users.map((sharedUser) => (
            <ListItem key={sharedUser.id} disableGutters>
              <ListItemButton onClick={() => handleListItemClick(sharedUser)} disabled={sharedUser.isActive}>
                <ListItemText primary={sharedUser.name} />
              </ListItemButton>
            </ListItem>
          ))}
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={() => handleCreateUserClick()}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Add account' />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  )
}

export default UsersDialog
