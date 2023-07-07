import { Button, Tooltip } from '@chakra-ui/react'

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
}): JSX.Element {
	return (
		<Button
			size={props.size}
			disabled={!props.visible ?? false}
			leftIcon={
				<>
					<Tooltip title={props.text}>{props.icon}</Tooltip>
				</>
			}
			iconSpacing={'auto'}
			variant={'ghost'}
			style={{
				...props.sx,
				opacity: props.visible ?? true ? 1 : 0,
			}}
			onClick={props.onClick}></Button>
	)
}
