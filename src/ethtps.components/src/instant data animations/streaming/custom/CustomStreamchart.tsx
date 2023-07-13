import { CustomSeries, IInstantDataAnimationProps, useVerticalScrolling } from "../../../.."
import { RollingGrid } from "./grid"

export function CustomStreamchart(props: IInstantDataAnimationProps) {
    const speed = useVerticalScrolling(props.duration, props.height)
    return <>
        <RollingGrid
            speed={speed}
            minXLines={10}
            minYLines={12}
            width={props.width}
            height={props.height}
            paused={props.paused}
            connected={props.connected} >
            <CustomSeries
                {...props}
                stacked />
        </RollingGrid>
    </>
}