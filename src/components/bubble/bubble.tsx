import React from 'react'
import { ListItem, ListItemText } from '@mui/material'

type Props = {
  date: string
} & React.PropsWithChildren

const Bubble: React.FC<Props> = ({ ...props }) => {
  return (
    <ListItem>
      <ListItemText primary={props.children} secondary={props.date} />
    </ListItem>
  )
}

export default Bubble
