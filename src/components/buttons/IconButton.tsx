import { Button } from '@mantine/core'

export function IconButton(props: {
  text?: string
  icon: JSX.Element
  sx?: any
  onClick?: () => void | undefined
}) {
  return (
    <Button sx={props.sx} onClick={props.onClick} leftIcon={props.icon}>
      {props.text}
    </Button>
  )
}
