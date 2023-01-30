import React from 'react'
import styles from './reply.module.scss'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

interface Props extends React.PropsWithChildren {
  onClose: () => void
}

const ReplyBox: React.FC<Props> = ({ children, onClose }) => {
  return (
    <Box
      className={styles.reply}
      sx={{
        backgroundColor: 'white'
      }}
    >
      <AppBar position='relative' color='transparent'>
        <Toolbar>
          <Typography variant='h6' component='div' overflow='hidden' noWrap>
            Replay to: {children}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => onClose()}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default ReplyBox
