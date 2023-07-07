
import { Text, Tooltip } from '@chakra-ui/react'
import { openNewTab } from '../../../..'
import { IconButton } from '../../IconButton'
import { IAnimatedLinkButtonWithIconProperties } from './IAnimatedLinkButtonWithIconProperties'

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
    <>
      <Tooltip hasArrow title={props.text}>
        <IconButton onClick={handleClick} icon={props.image}></IconButton>
      </Tooltip>
      {props.showText ? <Text>{props.text}</Text> : <></>}
    </>
  )
}
