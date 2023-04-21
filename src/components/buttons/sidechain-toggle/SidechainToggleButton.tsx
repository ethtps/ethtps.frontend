import { useAppDispatch, setIncludeSidechains } from '@/data'
import { Tooltip, Text } from '@mantine/core'
import { IconLink, IconLinkOff } from '@tabler/icons-react'
import React, { useState } from 'react'
import { IconButton } from '../IconButton'
import { ISidechainToggleButtonConfiguration } from './ISidechainToggleButtonConfiguration'

export function SidechainToggleButton(
  config: ISidechainToggleButtonConfiguration
) {
  const [on, setOn] = useState(config.defaultIncluded)
  const dispatch = useAppDispatch
  const toggle = () => {
    if (config.toggled) {
      config.toggled(!on)
      dispatch(setIncludeSidechains(!on))
    }
    setOn(!on)
  }
  return (
    <>
      <Tooltip
        withArrow
        label={
          <Text>
            Sidechains are {on ? 'included' : 'excluded'}. Click to
            {on ? 'exclude' : 'include'}
          </Text>
        }>
        <IconButton
          onClick={toggle}
          icon={
            on ? <IconLink color='primary' /> : <IconLinkOff />
          }></IconButton>
      </Tooltip>
    </>
  )
}
