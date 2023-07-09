import {
	Stat,
	StatArrow,
	StatHelpText,
	StatLabel,
	StatNumber,
	Tooltip,
} from '@chakra-ui/react'
import { BeatLoader } from 'react-spinners'
import { LiveDataDelta } from '.'
import {
	AnimatedTypography,
	binaryConditionalRender,
	conditionalRender,
	useColors,
} from '../../..'
import { numberFormat } from '../../../../ethtps.data/src'
import { MouseOverEvents } from '../types'

export function SimpleStat(
	props: {
		data: LiveDataDelta
		loading?: boolean
		isEstimated?: boolean
		isSelected?: boolean
		alt?: string
	} & MouseOverEvents
): JSX.Element {
	const colors = useColors()
	let deltaType: 'increase' | 'decrease' | undefined = undefined
	if (props.data.delta.type !== 'none') {
		if (props.data.delta.type === 'increase') {
			deltaType = 'increase'
		} else if (props.data.delta.type === 'decrease') {
			deltaType = 'decrease'
		}
	}
	const color = props.isSelected ?? false ? colors.text : colors.text
	const opacity = props.isSelected ?? false ? 1 : 0.5
	const transform = props.isSelected ?? false ? 'scale(1)' : 'scale(0.95)' // Added
	return (
		<>
			<Tooltip hasArrow label={props.alt ?? ''}>
				<Stat
					sx={{
						cursor: 'pointer',
						transition: 'transform 500ms, opacity 500ms', // Added
						transform: transform, // Added
						opacity: opacity,
					}}
					onMouseOver={props.onMouseOver}
					onMouseLeave={props.onMouseLeave}
					onClick={props.onClick}>
					<StatLabel className={'unselectable'} color={color}>
						{props.data.type.toUpperCase()}
					</StatLabel>
					<StatNumber color={color}>
						{binaryConditionalRender(
							<AnimatedTypography
								animationClassName="animated-cell unselectable"
								child={`${props.isEstimated ? '~' : ''
									}${numberFormat(props.data.value)}`}
								durationMs={800}
							/>,
							<>
								<BeatLoader size={8} color={color} />
							</>,
							!props.loading
						)}
					</StatNumber>
					{conditionalRender(
						<StatHelpText>
							<StatArrow type={deltaType} />
							<AnimatedTypography
								sx={{
									textColor: color,
								}}
								animationClassName="animated-cell inline unselectable"
								child={numberFormat(props.data.delta.value)}
								durationMs={800}
							/>
						</StatHelpText>,
						!props.loading
					)}
				</Stat>
			</Tooltip>
		</>
	)
}
