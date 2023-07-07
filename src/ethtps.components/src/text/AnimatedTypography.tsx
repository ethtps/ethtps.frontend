import { Text } from '@chakra-ui/react'

interface IAnimatedTypographyConfiguration {
	child: JSX.Element | string | number
	animationClassName: string
	durationMs: number
	sx?: any
	centerText?: boolean
}

export function AnimatedTypography(
	config: IAnimatedTypographyConfiguration
): JSX.Element {
	return (
		<>
			<Text
				{...config.sx}
				className={config.animationClassName}
				key={config.child.toString()}
				textAlign={config.centerText ? 'center' : undefined}>
				{config.child}
			</Text>
		</>
	)
}
