import * as d3 from "d3"
import { CSSProperties, useRef } from "react"
import { Padded, WithMargins, addGrid, measure, useGroupedDebugMeasuredEffect } from "../../.."
import { FrequencyLimiter } from "../../../../ethtps.data/src"


export function Axis({
    axis,
    orientation,
    sx,
    padding,
    margins,
    gridLines,
    name,
    parentHeight,
    parentWidth,
    children,
    interactive
}: {
    axis: d3.ScaleLinear<number, number, never> | d3.ScaleTime<number, number, never>,
    orientation: (scale: d3.AxisScale<d3.NumberValue>) => d3.Axis<d3.NumberValue>,
    sx: CSSProperties | undefined,
    padding?: Partial<Padded>,
    gridLines?: boolean,
    interactive?: boolean,
    children?: React.ReactNode,
    parentWidth?: number,
    parentHeight?: number,
    margins?: Partial<WithMargins>, name?: string
}) {
    const svgRef = useRef<any>()
    const areaRef = useRef<any>()
    measure(() => {
        if (!FrequencyLimiter.canExecute(`${name} axis change`)) {
            return
        }
        const node = svgRef.current
        if (!node || !axis) return
        const s = d3.select(node)
        s.transition(`d3-${name}-change`)
            .call(orientation(axis))
            .duration(1200)
            .selection()
            .transition()
    }, `Δrange`, `${name} axis`, [axis, orientation, name])
    useGroupedDebugMeasuredEffect(() => {
        if (!areaRef.current || !svgRef.current) return

        if (gridLines) {
            const node = d3.select(areaRef.current)
            addGrid(node,
                parentHeight ?? svgRef.current?.height?.baseVal?.value,
                parentWidth ?? svgRef.current?.width?.baseVal?.value,
                12,
                (orientation === d3.axisTop || orientation === d3.axisBottom) ? d3.scaleLinear()
                    .domain(axis.domain())
                    .range(axis.range()) : undefined,
                (orientation === d3.axisLeft || orientation === d3.axisRight) ? axis as d3.ScaleLinear<number, number, never> : undefined,
                padding,
                margins)
        }
    }, 'grid lines', `${name} axis`, [areaRef.current, svgRef.current, axis, orientation, gridLines, parentHeight, parentWidth, padding, margins])
    return <>
        <svg ref={svgRef} style={{ ...sx }} >
            <g ref={areaRef} >
                {children}
            </g>
        </svg>
    </>
}
