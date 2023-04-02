import { Tooltip, Text } from '@mantine/core'
import { Visibility } from '@mui/icons-material'
import React from 'react'
import { IconButton } from './IconButton'

export function CurrentViewersIcon() {
  return (
    <React.Fragment>
      <Tooltip withArrow label={<Text>Nobody&aposs here</Text>}>
        <IconButton icon={<Visibility></Visibility>}></IconButton>
      </Tooltip>
    </React.Fragment>
  )
}
