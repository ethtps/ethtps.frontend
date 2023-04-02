import { Visibility } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'

export function CurrentViewersIcon() {
  return (
    <React.Fragment>
      <Tooltip arrow title={<Text>Nobody's here</Text>}>
        <IconButton>
          <Visibility></Visibility>
        </IconButton>
      </Tooltip>
    </React.Fragment>
  )
}
