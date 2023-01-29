import React from 'react'
import { ListItem, ListItemText } from '@mui/material'
import styles from './bubble.module.scss'

type Props = {
  date: string
  src: string | null
} & React.PropsWithChildren

const Bubble: React.FC<Props> = ({ date, src, children }) => {
  return (
    <ListItem>
      <ListItemText primary={children} secondary={date} />
      {src && (
        <img
          className={styles.bubble__image}
          src={src}
          alt='messgae_image'
        />
      )}
    </ListItem>
  )
}

export default Bubble
