import React from 'react'
import { PhotoCamera } from '@mui/icons-material'
import { IconButton } from '@mui/material'

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'hidden'
>

const IconFileUpload: React.FC<Props> = ({ ...props }) => {
  return (
    <IconButton color='primary' aria-label='upload picture' component='label'>
      <input hidden type='file' {...props} />
      <PhotoCamera />
    </IconButton>
  )
}

export default IconFileUpload
