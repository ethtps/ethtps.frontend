import { ActionIcon, Button, Tooltip } from '@mantine/core'
import { MouseEventHandler } from 'react'

export function IconButton(props: {
  text?: string
  icon: JSX.Element
  sx?: any
  onClick?: () => void | undefined
  href?: string
  target?: string
  visible?: boolean
}) {
  return (
    <ActionIcon
      disabled={!props.visible ?? false}
      style={{
        ...props.sx,
        opacity: props.visible ?? true ? 1 : 0
      }}
      onClick={props.onClick}>
      <Tooltip arrowPosition={'center'} withArrow label={props.text}>{props.icon}</Tooltip>
    </ActionIcon>
  )
}
