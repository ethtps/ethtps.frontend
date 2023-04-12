import { Tooltip, Text } from '@mantine/core'
import React from 'react'
import { IconButton } from './IconButton'
import { IconEye } from '@tabler/icons-react'

export function CurrentViewersIcon() {
  return (
    <React.Fragment>
      <Tooltip withArrow label={<Text>Nobody&aposs here</Text>}>
        <IconButton icon={<IconEye />}></IconButton>
      </Tooltip>
    </React.Fragment>
  )
}
