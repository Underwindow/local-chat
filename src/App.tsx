import React from 'react'
import './App.scss'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { localStorageJSON, sessionStorageJSON } from '@/utils/storage'
import { setUser } from '@/store/slices/session'
import User from '@/model/user'
import Sidebar from '@/components/sidebar'
import Chat from '@/components/chat'
import useEffectOnce from '@/utils/useEffectOnce'
import { ChatsDoc, setChats } from '@/store/slices/chats'
import { loadDoc } from '@/utils/automerge'
import UsersDialog from '@/components/users-dialog';

const sidebarWidth: number = 320

const AppBar = styled(MuiAppBar)<MuiAppBarProps>(() => ({
  marginLeft: sidebarWidth,
  width: `calc(100% - ${sidebarWidth}px)`
}))

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.sessionState.user)
  const activeRoom = useAppSelector((state) => state.sessionState.activeRoom)

  useEffectOnce(() => {
    loadDoc<ChatsDoc>(localStorageJSON, __CHATS_LS__, (doc) =>
      dispatch(setChats(doc))
    )

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
          width: `calc(100% - ${sidebarWidth}px)`,
          mr: `${sidebarWidth}px`
        }}
      >
        <Toolbar>
          <Typography variant='h6'>
            React Chat User: {user?.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar width={sidebarWidth} />
      <UsersDialog open={user === null}/>
      {user && activeRoom && (
        <div
          style={{
            width: `calc(100% - ${sidebarWidth}px)`,
            marginRight: sidebarWidth,
            marginLeft: -sidebarWidth
          }}
        >
          <Box
            component='main'
            sx={{
              flexBasis: '50%'
            }}
          >
            <Toolbar />
            <Container maxWidth='lg' sx={{ mt: 4 }}>
              <Chat roomData={activeRoom} username={user.name} />
            </Container>
          </Box>
        </div>
      )}
    </Box>
  )
}

export default App
