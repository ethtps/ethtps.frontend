import {
	Box,
	Slider,
	SliderFilledTrack,
	SliderMark,
	SliderThumb,
} from '@chakra-ui/react'
import { ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { useColors } from '../../..'
import {
	EnumerateIntervals,
	TimeIntervalToLabel,
	TimeIntervalToSeconds,
} from '../../../../ethtps.data/src'

interface IIntervalSliderProps {
	onChange?: (interval: ETHTPSDataCoreTimeInterval) => void
}

export function IntervalSlider({
	onChange,
}: IIntervalSliderProps): JSX.Element {
	const colors = useColors()
	return (
		<Box>
			<Slider
				defaultValue={
					-TimeIntervalToSeconds(
						ETHTPSDataCoreTimeInterval.ONE_MINUTE
					)
				}
				min={
					-TimeIntervalToSeconds(ETHTPSDataCoreTimeInterval.ONE_YEAR)
				}
				max={
					-TimeIntervalToSeconds(
						ETHTPSDataCoreTimeInterval.ONE_MINUTE
					)
				}>
				{EnumerateIntervals().map((interval, index) => (
					<SliderMark
						key={`ti-${index}`}
						value={
							-TimeIntervalToSeconds(
								interval as ETHTPSDataCoreTimeInterval
							)
						}>
						{TimeIntervalToLabel(
							interval as ETHTPSDataCoreTimeInterval
						)}
					</SliderMark>
				))}
				<SliderFilledTrack bg={colors.gray1}>
					<SliderThumb boxSize={6} />
				</SliderFilledTrack>
			</Slider>
		</Box>
	)
}
