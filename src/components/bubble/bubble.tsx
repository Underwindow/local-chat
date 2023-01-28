import React from 'react'
import {
  ListItem,
  ListItemText,
} from '@mui/material'

type Props = {
} & React.PropsWithChildren

const Bubble: React.FC<Props> = ({...props}) => {
  return (
    <ListItem>
      <ListItemText primary={props.children} />
    </ListItem>
  )
}

export default Bubble
