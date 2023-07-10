import { InstantDataAnimationProps } from "../../../.."
import { Grid } from "./grid"

export function CustomStreamchart(props: InstantDataAnimationProps) {
    return <>
        <Grid
            speed={10}
            minXLines={10}
            minYLines={10}
            {...props} />
    </>
}