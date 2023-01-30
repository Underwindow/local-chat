import React from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'

interface Props extends React.PropsWithChildren {
  onEntry: () => void
  onDelete: () => void
  isSelected: boolean
}

const Room: React.FC<Props> = ({ onEntry, onDelete, children, isSelected }) => {
  return (
    <ListItem>
      <ListItemButton onClick={() => onEntry()} selected={isSelected}>
        <ListItemText primary={children} />
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
