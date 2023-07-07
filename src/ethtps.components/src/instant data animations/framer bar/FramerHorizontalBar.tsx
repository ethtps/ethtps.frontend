import { motion } from 'framer-motion'
import { IComponentSize } from '../../..'
import { LoadingAnimation } from './LoadingAnimation'

enum States {
	connecting,
	connected,
	disconnected,
	reconnecting,
}

export enum Direction {
	horizontal,
	vertical,
}
export interface IFramerHorizontalBarProps extends IComponentSize {}

export function FramerHorizontalBar(
	props: IFramerHorizontalBarProps
): JSX.Element {
	return (
		<>
			<motion.div
				style={{
					width: props.width,
					height: props.height,
					overflow: 'hidden',
					backgroundColor: '#37367b',
				}}>
				<LoadingAnimation />
			</motion.div>
		</>
	)
}
