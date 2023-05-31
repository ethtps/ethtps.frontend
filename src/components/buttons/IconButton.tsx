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
  size?: string
}) {
  return (
    <Button
      size={props.size}
      disabled={!props.visible ?? false}
      leftIcon={props.icon}
      iconSpacing={'auto'}
      variant={'ghost'}
      style={{
        ...props.sx,
        opacity: props.visible ?? true ? 1 : 0
      }}
      onClick={props.onClick}>
    </Button>
  )
}
