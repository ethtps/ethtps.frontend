'use client'

import { useColors } from '../../..'

//import { VISXStreamChart } from '@/components/'

export function LivePSPartial(props: {
	width: number
	value: number
}): JSX.Element {
	const colors = useColors()
	return (
		<>
			<svg width={props.width} height={500}>
				<rect
					width={props.width}
					height={500}
					fill={colors.secondary}
					rx={14}
				/>
			</svg>
		</>
	)
}
//<VISXStreamChart width={props.width} height={500} />
