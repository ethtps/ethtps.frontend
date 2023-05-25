import { Tooltip, Text } from '@chakra-ui/react'
import React from 'react'
import { IconButton } from './IconButton'
import { IconEye } from '@tabler/icons-react'

export function CurrentViewersIcon() {
  return (
    <>
      <Tooltip hasArrow label={<Text>Nobody&aposs here</Text>}>
        <IconButton icon={<IconEye />}></IconButton>
      </Tooltip>
    </>
  )
}
