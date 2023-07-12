import { Container, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { liveDataPointExtractor, useAccumulator } from '../'
import { binaryConditionalRender } from '../../../'
import { Streamgraph } from './'
const Tooltip = ({ opacity, text, x, y }) => {
	return (
		<text
			x={x}
			y={y}
			style={{ opacity: opacity, fontSize: 17, fill: 'black' }}>
			{text}
		</text>
	)
}

export const D3Stream = ({
	width,
	height,
	dataType,
	newestData,
	connected,
	providerData,
	maxEntries,
	duration,
	refreshInterval,
	showSidechains,
	paused,
	isLeaving,
}) => {
	const [opacity, setOpacity] = useState(0)
	const [text, setText] = useState('initialState')
	const [stacks, setStacks] = useState([])
	const [liveData, columns, lastValues, totals] = useAccumulator(newestData, maxEntries ?? 30, dataType ?? ETHTPSDataCoreDataType.TPS, providerData, refreshInterval)

	const processed = liveData.flatMap((d, i) => {
		let value =
			d !== undefined
				? liveDataPointExtractor(d, dataType)
				: lastValues[d.z] !== undefined
					? lastValues[d.z]
					: 0
		// Update the last value for this key.
		lastValues[d.z] = value
		return {
			x: d.x,
			y: value,
			z: d.z,
		}
	}
	)
	const stream = Streamgraph(processed,
		totals,
		{
			width: width,
			height: height,
			x: (d) => d.x,
			y: (d) => d.y,
			z: (d) => d.z,
			yLabel: 'TPS',
			//yDomain: [-Math.max(...totals), Math.max(...totals)],
		})

	const ref = useRef(null)
	useEffect(() => {
		if (!ref.current) return

		if (!ref.current.children[0]) ref.current.appendChild(stream)
		else ref.current.replaceChild(stream, ref.current.children[0])
	}, [ref, stream])
	return (
		<>
			{binaryConditionalRender(
				<>
					<motion.div
						initial={{ translateX: 0 }}
						animate={{ translateX: -width }}
						transition={{
							type: 'just',
							duration: 60 * 5 * 1000,
						}}>
						<div ref={ref} width={width} height={height}></div>
					</motion.div>
				</>,
				<>
					<Container marginTop={height / 2} centerContent>
						<BeatLoader size={8} color={'black'} />
						<Text>Connecting...</Text>
					</Container>
				</>,
				connected
			)}
		</>
	)
}
