import { animated, useSpring } from '@react-spring/web'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { Stack } from '@visx/shape'
import { transpose } from '@visx/vendor/d3-array'
import { useCallback, useMemo, useRef, useState } from 'react'
import { IInstantDataAnimationProps } from '../InstantDataAnimationProps'
import generateData from './TestData'
import * as d3 from 'd3'
import { LiveDataAccumulator, logToOverlay } from '../../../../ethtps.data/src'
import { getD3Scale } from '../d3-custom'
import { Viz } from '../d3-custom/helpers'
import { liveDataPointExtractor, useGroupedDebugMeasuredEffect, minimalDataPointToLiveDataPoint, measure } from '../hooks'
import { makeInteractive } from '../../..'

const NUM_LAYERS = 20
const SAMPLES_PER_LAYER = 200
const BUMPS_PER_LAYER = 10
export const BACKGROUND = '#ffdede'

// utils
const range = (n: number) => Array.from(new Array(n), (_, i) => i)

const keys = range(NUM_LAYERS)

// scales
const xScale = scaleLinear<number>({
    domain: [0, SAMPLES_PER_LAYER - 1],
})
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

export function VisStream(props: StreamGraphProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        timeInterval,
        maxEntries,
        dataPoints = 250,
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

    xScale.range([0, width])
    yScale.range([height, 0])

    // generate layers in render to update on touch
    const layers = transpose<number>(
        keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER)),
    )
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



    }, `transform`, 'data', [dataType, innerWidth, innerHeight, xAxis, yAxis, areaRef.current, pixelsPerPoint, accumulator])
    const handlePress = () => {
    }
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
                    offset="wiggle"
                    color={colorScale}
                    x={(_, i) => xScale(i) ?? 0}
                    y0={getY0}
                    y1={getY1}
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
