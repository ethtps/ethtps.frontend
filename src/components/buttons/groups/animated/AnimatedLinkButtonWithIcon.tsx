import { IAnimatedLinkButtonWithIconProperties } from './IAnimatedLinkButtonWithIconProperties'
import React from 'react'
import { openNewTab } from '@/services'
import { IconButton } from '../../IconButton'
import { Tooltip, Text } from '@mantine/core'

// No animation YET
export function AnimatedLinkButtonWithIcon(
  props: IAnimatedLinkButtonWithIconProperties
): JSX.Element {
  const handleClick = () => {
    if (props.openInNewTab) {
      openNewTab(props.href)
    } else {
      window.location.href = props.href
    }
  }
  return (
    <React.Fragment>
      <Tooltip withArrow label={<Text>{props.text}</Text>}>
        <IconButton onClick={handleClick} icon={props.image}></IconButton>
      </Tooltip>
      {props.showText ? <Text>{props.text}</Text> : <></>}
    </React.Fragment>
  )
}
