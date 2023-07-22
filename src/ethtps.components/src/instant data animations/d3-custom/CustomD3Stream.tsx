import * as d3 from 'd3'
import { useCallback, useMemo, useRef, useState } from "react"
import { Axis, getD3Scale, liveDataPointExtractor, makeInteractive, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { LiveDataAccumulator, logToOverlay } from '../../../../ethtps.data/src'
import { default as VizLines } from './helpers/D3VisualLines'
import { default as Viz } from './helpers/D3Visual'
/**
 * Junk data generator function
 */
const f = (x: number): number => 0// Math.sin(x / 10 + Math.random())

const duration = 5000
let xOffset = 0

export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        timeInterval,
        maxEntries,
        dataPoints = 250
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
        marginBottom: 30
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
    const areaRef = useRef<any>(null)
    const pixelsPerPoint = useMemo(() => innerWidth / maxEntries, [innerWidth, maxEntries])
    const [dx, setDx] = useState<number>(0)
    const [xBounds, setXBounds] = useState<[number, number]>(() => [0, 0])
    const [accumulator] = useState<LiveDataAccumulator>(() => new LiveDataAccumulator({}))
    const xAxis = useMemo(() =>
        getD3Scale(xBounds,
            [0 + dx, innerWidth + dx]),
        [xBounds, innerWidth, dx])

    const yGen = useCallback(() => d3.scaleLinear().domain([-(liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 0), liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1]).nice().range([0, innerHeight]), [dataType, innerHeight, accumulator.maxTotal])
    const yAxis = yGen()
    useGroupedDebugMeasuredEffect(() => {
        if (!newestData) return
        minimalDataPointToLiveDataPoint
        accumulator.insert(newestData)
        setXBounds([...accumulator.timeRange])
        setDx((d) => d + pixelsPerPoint)
    }, 'update', 'data', [newestData, pixelsPerPoint, accumulator])
    measure(() => {
        logToOverlay({
            name: `[Nx, Ny]`,
            details: `[${accumulator.timePoints}, ${accumulator.valuePoints}]`,
            level: accumulator.loadedCache ? 'info' : 'warn'
        })
        if (!areaRef.current) return

        const selectArea = () => d3.select(areaRef?.current)
        selectArea().selectAll('*').remove()
        //const stack = DataTransformHelper.stack(accumulator, dataType)
        selectArea().call(Viz.streamAreaFrom(accumulator, dataType, { x: xAxis, y: yAxis }, d3.schemeRdBu[Math.min(11, accumulator.distinctProviders.length)], 0.8))


    }, `transform`, 'data', [dataType, innerWidth, innerHeight, xAxis, yAxis, areaRef.current, pixelsPerPoint, accumulator])

    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={width}
            height={height}>
            <Axis
                sx={{
                    transform: `translateX(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px)`
                }}
                orientation={d3.axisBottom}
                axis={xAxis}
                name={'x'}
                gridLines
                parentWidth={width}
                parentHeight={height}
                padding={padding}
                margins={margins}
            />
            <Axis
                sx={{
                    transform: `translate(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px, ${(padding?.paddingTop ?? 0) + (margins?.marginTop ?? 0)}px)`
                }}
                orientation={d3.axisRight}
                axis={yAxis}
                name={'y'}
                gridLines
                parentWidth={width}
                parentHeight={height}
                padding={padding}
                margins={margins}
            />
            <svg ref={areaRef}>

            </svg>
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