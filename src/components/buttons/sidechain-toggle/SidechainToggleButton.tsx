import { useState } from 'react'
import React from 'react'
import { ISidechainToggleButtonConfiguration } from './ISidechainToggleButtonConfiguration'
import { setIncludeSidechains } from '@/data/src/slices/LiveDataSlice'
import { Tooltip, Text } from '@mantine/core'
import { IconButton } from '../IconButton'
import { IconLink, IconLinkOff } from '@tabler/icons-react'
import { useAppDispatch } from '@/data/src/store'
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
    <React.Fragment>
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
    </React.Fragment>
  )
}
