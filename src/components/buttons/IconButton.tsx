import { Tooltip, Button } from '@chakra-ui/react'
import { MouseEventHandler } from 'react'

export function IconButton(props: {
  text?: string
  icon: JSX.Element
  sx?: any
  onClick?: () => void | undefined
  href?: string
  target?: string
  visible?: boolean
  bottom?: boolean
}) {
  return (
    <Button
      disabled={!props.visible ?? false}
      style={{
        ...props.sx,
        opacity: props.visible ?? true ? 1 : 0
      }}
      onClick={props.onClick}>
      <Tooltip hasArrow label={props.text}>{props.icon}</Tooltip>
    </Button>
  )
}
