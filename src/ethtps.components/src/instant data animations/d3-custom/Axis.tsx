import * as d3 from "d3"
import { CSSProperties, useEffect, useRef } from "react"
import { Padded, WithMargins, addD3Axis } from "../../.."


export function Axis(props: {
    axis: d3.ScaleLinear<number, number, never>,
    orientation: (scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>,
    sx: CSSProperties | undefined,
    padding?: Partial<Padded>,
    margins?: Partial<WithMargins>, name?: string
}) {
    const ref = useRef<any>()
    addD3Axis(props.axis, props.orientation, ref, props.padding, props.margins, props.name)
    return <>
        <g ref={ref} style={{ ...props.sx }} />
    </>
}
