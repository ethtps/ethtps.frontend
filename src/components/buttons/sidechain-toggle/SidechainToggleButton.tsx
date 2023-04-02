import { Link, LinkOff } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/material'
import { useState } from 'react'
import React from 'react'
import { ISidechainToggleButtonConfiguration } from './ISidechainToggleButtonConfiguration'
import { setIncludeSidechains } from '@/data/src/slices/LiveDataSlice'
import { useDispatch } from 'react-redux'

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
        arrow
        title={
          <Text>
            Sidechains are {on ? 'included' : 'excluded'}. Click to
            {on ? 'exclude' : 'include'}
          </Text>
        }>
        <IconButton onClick={toggle}>
          {on ? <Link color='primary' /> : <LinkOff />}
        </IconButton>
      </Tooltip>
    </React.Fragment>
  )
}
