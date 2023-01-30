import React from 'react'
import './App.scss'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import User from '@/model/user'
import { ChatsDoc, setChats } from '@/store/slices/chats'
import { setUser } from '@/store/slices/session'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { localStorageJSON, sessionStorageJSON } from '@/utils/storage'
import { loadDoc } from '@/utils/automerge'
import useEffectOnce from '@/utils/useEffectOnce'
import Sidebar from '@/components/sidebar'
import Chat from '@/components/chat'
import UsersDialog from '@/components/users-dialog'
import { UsersDoc, setSharedUsers } from './store/slices/users'

const sidebarWidth: number = 320

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.sessionState.user)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)

  useEffectOnce(() => {
    const userData = sessionStorageJSON.getItem<User>(__USER_SS__)
    if (userData !== null) {
      dispatch(setUser(userData))
    }
  })

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        sx={{
          marginLeft: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          mr: `${sidebarWidth}px`
        }}
      >
        {user && (
          <Toolbar>
            <Typography variant='h6'>React Chat User: {user.name}</Typography>
          </Toolbar>
        )}
      </AppBar>
      <Sidebar width={sidebarWidth} />
      <UsersDialog open={user === null} />
      {user && activeRoom && (
        <Box
          component='main'
          style={{
            width: `calc(100% - ${sidebarWidth}px)`,
            marginRight: sidebarWidth,
            marginLeft: -sidebarWidth
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4 }}>
            <Chat roomData={activeRoom} username={user.name} />
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default App
