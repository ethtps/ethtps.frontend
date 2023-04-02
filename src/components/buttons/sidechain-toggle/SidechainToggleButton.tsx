import { Link, LinkOff } from '@mui/icons-material'
import { useState } from 'react'
import React from 'react'
import { ISidechainToggleButtonConfiguration } from './ISidechainToggleButtonConfiguration'
import { setIncludeSidechains } from '@/data/src/slices/LiveDataSlice'
import { useDispatch } from 'react-redux'
import { Tooltip, Text } from '@mantine/core'
import { IconButton } from '../IconButton'
export function SidechainToggleButton(
  config: ISidechainToggleButtonConfiguration
) {
  const [on, setOn] = useState(config.defaultIncluded)
  const dispatch = useDispatch()
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
          icon={on ? <Link color='primary' /> : <LinkOff />}></IconButton>
      </Tooltip>
    </React.Fragment>
  )
}
