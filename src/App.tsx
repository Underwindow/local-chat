import React, { useEffect } from 'react'
import './App.scss'
import { nanoid } from 'nanoid'
import { faker } from '@faker-js/faker'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { styled } from '@mui/material/styles'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { useAppDispatch, useAppSelector } from '@/utils/redux'
import { localStorage, sessionStorage } from '@/utils/storage'
import { setChats, setUser } from '@/store/slices/session'
import User from '@/model/user'
import Sidebar from '@/components/sidebar'
import Chat from '@/components/chat'
import useEffectOnce from '@/utils/useEffectOnce'
import { ChatsDoc } from '@/model/chats-doc'
import * as Automerge from '@automerge/automerge'

const sidebarWidth: number = 320

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ open }) => ({
  ...(open && {
    marginLeft: sidebarWidth,
    width: `calc(100% - ${sidebarWidth}px)`
  })
}))

const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.session.user)
  const activeRoom = useAppSelector((state) => state.session.activeRoom)

  useEffectOnce(() => {
    const chatsDocJsonBinary = localStorage.getItem<[]>('chats')
    console.log('chatsDocBinary', chatsDocJsonBinary);
    
    if (chatsDocJsonBinary) {
      const chatsDocBinary = new Uint8Array(chatsDocJsonBinary)
      console.log('chatsDocBinary', chatsDocBinary);

      const chatsDoc = Automerge.load<ChatsDoc>(chatsDocBinary)
      console.log('chatsDoc from binary', chatsDoc);
      dispatch(setChats(chatsDoc))
    }
  })

  useEffect(() => {
    const userData = sessionStorage.getItem<User>('user')
    console.log(userData)

    dispatch(
      setUser(userData ?? { name: faker.name.fullName(), id: nanoid(8) })
    )
  }, [])

  useEffect(() => {
    console.log(user)

    if (user !== null) sessionStorage.setItem<User>('user', user)
  }, [user])

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
            React Chat User: {user?.name} {user?.id}
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar width={sidebarWidth} />
      {user && activeRoom && (
        <Box
          component='main'
          sx={{
            flexBasis: '50%'
          }}
        >
          <Toolbar />
          <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
            <Chat roomData={activeRoom} username={user.name} />
          </Container>
        </Box>
      )}
    </Box>
  )
}

export default App
