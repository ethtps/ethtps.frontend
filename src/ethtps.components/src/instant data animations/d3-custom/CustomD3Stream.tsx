import * as d3 from 'd3'
import { useEffect, useRef, useState } from "react"
import { makeInteractive, useD3Scale, useDebugMeasuredEffect, useXAxisBounds, useYAxisBounds } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { FrequencyLimiter } from "../../../../ethtps.data/src"


export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        maxEntries,
    } = props
    const {
        width,
        height,
        padding,
        margins,
        viewBox,
        bounds,
        innerWidth,
        innerHeight
    } = makeInteractive(props, {
        marginLeft: 10,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    }, {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    })
    const {
        horizontalPadding,
        verticalPadding
    } = padding ?? { horizontalPadding: 0, verticalPadding: 0 }
    const svgRef = useRef<any>(null)
    const [mountTime, setMountTime] = useState<number>()
    useEffect(() => {
        setMountTime(Date.now())
        console.clear()
    }, [])

    const xBounds = useXAxisBounds(props.timeInterval)
    const yBounds = useYAxisBounds(newestData ?? {}, dataType)
    const xAxis = useD3Scale(xBounds, [0, innerWidth])

    useDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute('x axis')) return
        const node = svgRef.current
        if (!node || !xAxis) return
        const s = d3.select(node)
            .append('g')
        s.call(d3.axisTop(xAxis))
    }, 'x axis', [svgRef.current, xAxis])

    const yAxis = useD3Scale(yBounds, [innerHeight, 0])

    useEffect(() => {
        if (!FrequencyLimiter.canExecute('y axis')) return
        const svg = svgRef.current
        if (!svgRef.current || !yAxis) return
        const s = d3.select(svg)
        s.select('g').remove()
        s.append('g')
            .attr('transform', `translate(${horizontalPadding ?? 0}, ${verticalPadding ?? 0})`)
            .attr('width', innerWidth)
            .attr('height', innerHeight)
        s.call(d3.axisLeft(yAxis).ticks(10))

    }, [svgRef.current, yAxis])

    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={innerWidth}
            height={innerHeight}>
        </svg>
    </>
}

/*
            viewBox={`${bounds[0]} ${bounds[1]} ${bounds[2]} ${bounds[3]}`}>
  <g>

            </g>
            <g>
                <Axis padding={20} position={AxisPosition.Left} min={-TimeIntervalToStreamProps(timeInterval).duration / 1000} max={0} width={70} height={height} marginLeft={10} />
            </g>
*/