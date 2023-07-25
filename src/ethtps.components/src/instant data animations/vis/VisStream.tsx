import { animated, useSpring } from '@react-spring/web'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { Stack } from '@visx/shape'
import * as d3 from 'd3'
import { useCallback, useMemo, useRef, useState } from 'react'
import { makeInteractive } from '../../..'
import { LiveDataAccumulator, logToOverlay } from '../../../../ethtps.data/src'
import { IInstantDataAnimationProps } from '../InstantDataAnimationProps'
import { getD3Scale } from '../d3-custom'
import { liveDataPointExtractor, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../hooks'

const NUM_LAYERS = 20
export const BACKGROUND = '#ffdede'

// utils
const range = (n: number) => Array.from(new Array(n), (_, i) => i)

const keys = range(NUM_LAYERS)
const yScale = scaleLinear<number>({
    domain: [-30, 50],
})
const colorScale = scaleOrdinal<number, string>({
    domain: keys,
    range: ['#ffc409', '#f14702', '#262d97', 'white', '#036ecd', '#9ecadd', '#51666e'],
})
const patternScale = scaleOrdinal<number, string>({
    domain: keys,
    range: ['mustard', 'cherry', 'navy', 'circles', 'circles', 'circles', 'circles'],
})

// accessors
type Datum = number[]
const getY0 = (d: Datum) => yScale(d[0]) ?? 0
const getY1 = (d: Datum) => yScale(d[1]) ?? 0

export type StreamGraphProps = IInstantDataAnimationProps & {
    width: number
    height: number
    animate?: boolean
}

function formatArray(arr: number[], length: number): number[] {
    // If the provided array is longer than the specified length, return the last 'length' elements
    if (arr.length >= length) {
        return arr.slice(-length)
    }

    // If the provided array is shorter than the specified length, prepend it with zeroes
    const zeros = Array(length - arr.length).fill(0)
    return zeros.concat(arr)
}


export function VisStream(props: StreamGraphProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        timeInterval,
        maxEntries,
        dataPoints = 25,
        animate = true
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
    const begin = performance.now()
    const [accumulator] = useState<LiveDataAccumulator>(() => new LiveDataAccumulator({}))

    const nx = useMemo(() => Math.min(dataPoints, Math.max(accumulator.timePoints, 1)), [dataPoints, accumulator.timePoints])

    const layers = d3.transpose(
        (accumulator.distinctProviders.length > 0 ? accumulator.distinctProviders : ['nothing really']).map((p) => formatArray(
            accumulator.getDataPointsFor(p)!
                .map((d) =>
                    liveDataPointExtractor(d, dataType) ?? 0),
            nx)

        ))
    const svgRef = useRef<any>(null)
    const areaRef = useRef<any>(null)
    const pixelsPerPoint = useMemo(() => innerWidth / maxEntries, [innerWidth, maxEntries])
    const [dx, setDx] = useState<number>(0)
    const [xBounds, setXBounds] = useState<[number, number]>(() => [0, 0])
    const xAxis = useMemo(() => scaleLinear<number>({
        domain: [0, nx - 1],
        range: [0, innerWidth]
    }), [innerWidth, nx])
    const absY = useMemo(() => scaleLinear<number>({
        domain: [-(liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1), liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1],
        range: [innerHeight, 0]
    }), [innerHeight, dataType, accumulator.maxTotal])

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



    }, `transform`, 'data', [dataType, innerWidth, innerHeight, xAxis, yAxis, areaRef.current, pixelsPerPoint, accumulator])
    const handlePress = () => {
    }
    logToOverlay({
        name: `VisStream`,
        details: `Rendered in ${(performance.now() - begin).toFixed(2)}ms`,
        level: 'info'
    })
    return (
        <svg width={width} height={height}>
            <PatternCircles id="mustard" height={40} width={40} radius={5} fill="#036ecf" complement />
            <PatternWaves
                id="cherry"
                height={12}
                width={12}
                fill="transparent"
                stroke="#232493"
                strokeWidth={1}
            />
            <PatternCircles id="navy" height={60} width={60} radius={10} fill="white" complement />
            <PatternCircles
                complement
                id="circles"
                height={60}
                width={60}
                radius={10}
                fill="transparent"
            />

            <g onClick={handlePress} onTouchStart={handlePress}>
                <rect x={0} y={0} width={width} height={height} fill={BACKGROUND} rx={14} />
                <Stack<number[], number>
                    data={layers}
                    keys={keys}
                    color={colorScale}
                    offset={"wiggle"}
                    curve={d3.curveCatmullRom.alpha(0.5)}
                    x={(_, i) => xAxis(i) ?? 0}
                    y0={d => absY(d[0])}
                    y1={d => absY(d[1])}
                >
                    {({ stacks, path }) =>
                        stacks.map((stack) => {
                            // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
                            const pathString = path(stack) || ''
                            const tweened = animate ? useSpring({ pathString }) : { pathString }
                            const color = colorScale(stack.key)
                            const pattern = patternScale(stack.key)
                            return (
                                <g key={`series-${stack.key}`}>
                                    <animated.path d={tweened.pathString} fill={color} />
                                    <animated.path d={tweened.pathString} fill={`url(#${pattern})`} />
                                </g>
                            )
                        })
                    }
                </Stack>
            </g>
        </svg>
    )
}
