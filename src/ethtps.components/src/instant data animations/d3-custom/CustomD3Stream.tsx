import * as d3 from 'd3'
import { ZoomTransform } from 'd3'
import { useCallback, useMemo, useRef, useState } from "react"
import { Axis, InteractiveSVG, getD3Scale, liveDataPointExtractor, makeInteractive, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { LiveDataAccumulator, LiveDataPoint } from '../../../../ethtps.data/src'
import { D3Helper } from './D3Helper'

const accumulator = new LiveDataAccumulator()

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
    const [data, setData] = useState<LiveDataPoint[]>([])
    const pixelsPerPoint = useMemo(() => innerWidth / maxEntries, [innerWidth, maxEntries])
    const [dx, setDx] = useState<number>(0)
    const xBounds = useMemo(() => accumulator.timeRange, [data])//To remove after implementing scrolling

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
        setData(d => {
            return [...accumulator.getDataPointsFor('Polygon') ?? []]
        })
        setDx((d) => d + pixelsPerPoint)
    }, 'update', 'data', [newestData, pixelsPerPoint, accumulator])
    measure(() => {
        if (!areaRef.current || !data) return

        const testData = [...data]

        const extent = d3.extent(testData, (d) => liveDataPointExtractor(d, dataType) ?? 0)
        extent[0] = -extent[1]!

        const yScale = d3.scaleLinear().domain(extent as [number, number])
            .nice()
            .range([0, innerHeight])
        const area = d3.area<LiveDataPoint>()
            .x((d: LiveDataPoint) => xAxis(d?.x!))
            .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
            .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
            .curve(d3.curveCatmullRom.alpha(0.5))

        const selectArea = () => d3.select(areaRef?.current)
        selectArea().selectAll('*').remove()
        selectArea().append('path')
            .attr('d', area(testData.slice(0, testData.length - 1)))
        const interpolator = D3Helper.getLastPointPairInterpolator(xAxis, yScale, dataType, testData)
        if (!!interpolator) {
            selectArea().call(D3Helper.lastPointPairAnimation(interpolator))
        }
        selectArea().call(d3.zoom(), new ZoomTransform(1, -xOffset, 0))
        // transform()
        //after transition
        selectArea()
            .attr('stroke-width', 0)
            .attr('fill', 'blue')
            .attr('fill-opacity', 0.5)
    }, 'transform', 'data', [data, dataType, innerWidth, innerHeight, xAxis, areaRef.current, pixelsPerPoint, accumulator.lastEntry, accumulator.maxTotal])

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
            <InteractiveSVG minX={dx} minY={0} width={innerWidth} height={innerHeight}>
            </InteractiveSVG>
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