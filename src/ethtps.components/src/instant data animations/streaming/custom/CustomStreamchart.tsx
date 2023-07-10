import { InstantDataAnimationProps, useVerticalScrolling } from "../../../.."
import { Grid } from "./grid"

export function CustomStreamchart(props: InstantDataAnimationProps) {
    const speed = useVerticalScrolling(props.duration, props.height)
    return <>
        <Grid
            speed={speed}
            minXLines={10}
            minYLines={10}
            width={props.width}
            height={props.height}
            paused={props.paused}
            connected={props.connected} />
    </>
}