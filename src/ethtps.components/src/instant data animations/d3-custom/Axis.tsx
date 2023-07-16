import * as d3 from "d3"
import { CSSProperties, useEffect, useRef } from "react"
import { Padded, WithMargins, addD3Axis, useGroupedDebugMeasuredEffect } from "../../.."
import { FrequencyLimiter, logToOverlay } from "../../../../ethtps.data/src"


export function Axis({
    axis,
    orientation,
    sx,
    padding,
    margins,
    name
}: {
    axis: d3.ScaleLinear<number, number, never>,
    orientation: (scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>,
    sx: CSSProperties | undefined,
    padding?: Partial<Padded>,
    margins?: Partial<WithMargins>, name?: string
}) {
    const svgRef = useRef<any>()
    useGroupedDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis change`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.transition(`d3-${name}-change`)
            .delay(1000)
            .duration(750)
            .selection()
            .call(orientation(axis))
            .style("fill", "red")
            .transition()
            .style('fill', 'transparent')
            .transition()
    }, `Δv`, `${name} axis`, [axis, orientation, svgRef, padding, margins, name])
    return <>
        <g ref={svgRef} style={{ ...sx }} />
    </>
}
