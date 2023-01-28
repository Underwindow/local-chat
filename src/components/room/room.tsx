import React from 'react'
import {
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type Props = {
  onEntry: () => void
  onDelete: () => void
  isSelected: boolean
} & React.PropsWithChildren

const Room: React.FC<Props> = ({ onEntry, onDelete, children, isSelected }) => {
  return (
    <ListItem>
      <ListItemButton onClick={() => onEntry()} selected={isSelected}>
        <ListItemText primary={children}/>
      </ListItemButton>
      <ListItemIcon>
        <IconButton onClick={() => onDelete()} color='error'>
          <DeleteIcon />
        </IconButton>
      </ListItemIcon>
    </ListItem>
  )
}

export default Room
