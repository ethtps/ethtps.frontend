import { TimeInterval } from "@/api-client"
import { TimeIntervalToSeconds, EnumerateIntervals, TimeIntervalToLabel } from "@/data"
import { useColors } from "@/services"
import { Slider, SliderTrack, SliderMark, SliderThumb, Box, SliderFilledTrack } from "@chakra-ui/react"

interface IIntervalSliderProps {
    onChange?: (interval: TimeInterval) => void
}


export function IntervalSlider({ onChange }: IIntervalSliderProps) {
    const colors = useColors()
    return <Box>
        <Slider
            defaultValue={-TimeIntervalToSeconds(TimeInterval.OneMinute)}
            min={-TimeIntervalToSeconds(TimeInterval.OneYear)}
            max={-TimeIntervalToSeconds(TimeInterval.OneMinute)}
        >
            {EnumerateIntervals().map((interval, index) => <SliderMark key={`ti-${index}`} value={-TimeIntervalToSeconds(interval)} >
                {TimeIntervalToLabel(interval)}
            </SliderMark>)}
            <SliderFilledTrack bg={colors.gray1}>
                <SliderThumb boxSize={6} />
            </SliderFilledTrack>
        </Slider>
    </Box>
}