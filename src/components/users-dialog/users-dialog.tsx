import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import AddIcon from '@mui/icons-material/Add'
import * as Automerge from '@automerge/automerge'
import { UsersDoc, setSharedUsers } from '@/store/slices/users'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { faker } from '@faker-js/faker'
import { nanoid } from 'nanoid'
import { updateDoc } from '@/utils/automerge'
import { sessionStorageJSON } from '@/utils/storage'
import User from '@/model/user'
import { setUser } from '@/store/slices/session'

export interface Props {
  open: boolean
}

const UsersDialog: React.FC<Props> = ({ ...props }) => {
  const dispatch = useAppDispatch()

  const { open } = props
  const user = useAppSelector((state) => state.sessionState.user)
  const sharedUsers = useAppSelector((state) => state.usersState.sharedUsers)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  useEffect(() => {
    setChannel(new BroadcastChannel(__USERS_LS__))

    return () => channel?.close()
  }, [])

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

  function setSharedUserActive(
    sharedUser: User,
    value: boolean,
    onSuccess?: (user: User) => void
  ): void {
    if (!channel) return

    const newUserState: User = {
      id: sharedUser.id,
      name: sharedUser.name
      // isActive: value,
    }

    // const newSharedUsers = Automerge.change<UsersDoc>(
    //   sharedUsers,
    //   'Add user',
    //   (currUsers) => {
    //     const id = currUsers.users.findIndex((user) => user.id === sharedUser.id)
    //     currUsers.users[id] = newUserState
    //   }
    // )

    // updateDoc(newSharedUsers, channel)
    // dispatch(setSharedUsers(newSharedUsers))

    if (onSuccess) onSuccess(newUserState)
  }

  function handleListItemClick(sharedUser: User): void {
    setSharedUserActive(sharedUser, true, (user) => {
      sessionStorageJSON.setItem<User>(__USER_SS__, user)
      dispatch(setUser(user))
    })
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
          id: nanoid(8)
          // isActive: false
        })
      }
    )

    updateDoc(newSharedUsers, channel)
    dispatch(setSharedUsers(newSharedUsers))
  }

  return (
    <Dialog open={open} sx={{ visibility: !!user ? 'hidden' : 'visible' }}>
      <DialogTitle>Choose your account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {sharedUsers.users &&
          sharedUsers.users.map((user) => (
            <ListItem key={user.id} disableGutters>
              <ListItemButton
                onClick={() => handleListItemClick(user)}
                // disabled={user.isActive}
              >
                <ListItemText primary={user.name} />
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
