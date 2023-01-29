import { Button, ButtonGroup, Popper } from '@mui/material'
import React from 'react'
import { PopperProps } from '@mui/material/Popper';

type Props = {
  open: boolean
  anchorEl: PopperProps['anchorEl']
  onReply: () => void
}

const BubblePopover: React.FC<Props> = ({ open, anchorEl, onReply }) => {
  return (
    <Popper
      open={open}
      placement='bottom'
      disablePortal={false}
      modifiers={[
        {
          name: 'flip',
          enabled: false,
          options: {
            altBoundary: false,
            rootBoundary: 'document',
            padding: 8
          }
        },
        {
          name: 'preventOverflow',
          enabled: false,
          options: {
            altAxis: false,
            altBoundary: false,
            tether: false,
            rootBoundary: 'viewport',
            padding: 8
          }
        },
        {
          name: 'arrow',
          enabled: true,
          options: {
            element: anchorEl
          }
        }
      ]}
    >
      <ButtonGroup
        variant='contained'
        aria-label='outlined primary button group'
      >
        <Button onClick={() => onReply()}>Reply</Button>
      </ButtonGroup>
    </Popper>
  )
}

export default BubblePopover
