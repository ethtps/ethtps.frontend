import { useSize } from '@chakra-ui/react-use-size'
import { animated, useSpring } from '@react-spring/web'
import { Drag } from '@visx/drag'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { Stack } from '@visx/shape'
import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Vector2D, VisTooltip, WithMargins, makeInteractive, useColors } from '../../..'
import { LiveDataAccumulator, logToOverlay } from '../../../../ethtps.data/src'
import { IInstantDataAnimationProps } from '../InstantDataAnimationProps'
import { liveDataPointExtractor, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../hooks'
import { VisAxes } from './axes/VisAxes'
import { motion, useAnimate, animate as motionAnimate, useSpring as useMotionSpring, useMotionValue } from 'framer-motion'
import { Vector } from 'three'

const MAX_LAYERS = 20 // preset number of layers to show because of hooks and springs 🪝🔧

const range = (n: number) => Array.from(new Array(n), (_, i) => i)

const keys = range(MAX_LAYERS)
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

export type StreamGraphProps = IInstantDataAnimationProps & Partial<WithMargins> & {
    width: number
    height?: number | undefined
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

export function VisStream(props: Partial<StreamGraphProps>) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        timeInterval,
        maxEntries,
        dataPoints = 100,
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
    } = makeInteractive(props, {}, {
        paddingLeft: 10,
        paddingRight: 10,
    })
    const begin = performance.now()
    const [dragOffset, setDragOffset] = useState<Vector2D>(Vector2D.Zero)
    const [accumulator] = useState<LiveDataAccumulator>(() => new LiveDataAccumulator({}))
    const svgRef = useRef<any>(null)
    const svgSize = useSize(svgRef)
    const actualHeight = svgSize?.height ?? height ?? 500
    const colors = useColors()
    const nx = useMemo(() => Math.min(dataPoints, Math.max(accumulator.timePoints, 1)), [dataPoints, accumulator.timePoints])
    const layers = d3.transpose(
        (accumulator.distinctProviders.length > 0 ? accumulator.distinctProviders : ['nothing really']).map((p) => formatArray(
            accumulator.getDataPointsFor(p)!
                .map((d) =>
                    liveDataPointExtractor(d, dataType) ?? 0),
            nx)

        ))
    const xAxis = useMemo(() => scaleLinear<number>({
        domain: [0, nx - 1],
        range: [0, width]
    }), [width, nx])
    const absY = useMemo(() => scaleLinear<number>({
        domain: [-(liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1), liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1],
        range: [actualHeight, 0]
    }), [actualHeight, accumulator.maxTotal, dataType])
    useGroupedDebugMeasuredEffect(() => {
        if (!newestData) return
        minimalDataPointToLiveDataPoint
        accumulator.insert(newestData)
    }, 'update', 'data', [newestData, accumulator])
    measure(() => {
        logToOverlay({
            name: `[Nx, Ny]`,
            details: `[${accumulator.timePoints}, ${accumulator.valuePoints}]`,
            level: accumulator.loadedCache ? 'info' : 'warn'
        })
    }, `transform`, 'data', [dataType, innerWidth, innerHeight, accumulator])
    const translateX = useMotionSpring(0, { stiffness: 1000, damping: 100 })
    const translateY = useMotionSpring(0, { stiffness: 1000, damping: 100 })
    logToOverlay({
        name: `VisStream`,
        details: `Rendered in ${(performance.now() - begin).toFixed(2)}ms`,
        level: 'info'
    })
    const [tooltipData, setTooltipData] = useState<JSX.Element>()
    return <>
        <ParentSize>{({ width, height }) =>
            <VisTooltip
                forwardRef={svgRef}
                content={tooltipData}
                width={width}
                height={height}>
                <svg
                    style={{ cursor: 'grab' }}
                    ref={svgRef}
                    width={width}
                    height={height}>
                    <PatternCircles
                        id="mustard" height={40} width={40} radius={5} fill="#036ecf" complement />
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
                    <motion.rect
                        width={width}
                        height={height}
                        fill={colors.chartBackground}
                        rx={14} />
                    <Drag
                        key={'streamdrag'}
                        width={width}
                        height={height}
                        resetOnStart
                        onDragEnd={(offset) => {
                            setDragOffset({ x: offset.x, y: offset.y } as Vector2D)
                            translateX.set(offset.dx, false)
                            translateX.set(0)
                            translateY.set(offset.dy, false)
                            translateY.set(0)
                        }}
                    >
                        {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
                            <motion.g
                                style={{
                                    translateX: (isDragging ? dx : translateX),
                                    translateY: (isDragging ? dy : translateY),
                                }}
                                onMouseMove={dragMove}
                                onMouseUp={dragEnd}
                                onMouseDown={dragStart}
                                onTouchStart={dragStart}
                                onTouchMove={dragMove}
                                onTouchEnd={dragEnd}>
                                <motion.rect
                                    width={width}
                                    height={height}
                                    fill={colors.chartBackground}
                                    rx={14} />
                                <Stack<number[], number>
                                    data={layers}
                                    keys={keys}
                                    color={colorScale}
                                    offset={'wiggle'}
                                    curve={d3.curveCatmullRom.alpha(0.8)}
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
                                                <g
                                                    style={{
                                                        cursor: 'zoom-in',
                                                        pointerEvents: 'none'
                                                    }}
                                                    key={`series-${stack.key}`}
                                                    onPointerMove={() => setTooltipData(<>
                                                        {stack.key}
                                                    </>)}
                                                    onPointerOut={() => {
                                                        setTooltipData(undefined)
                                                    }}>
                                                    <animated.path className={'nopointer'} d={tweened.pathString} fill={color} />
                                                    <animated.path className={'nopointer'} d={tweened.pathString} fill={`url(#${pattern})`} />
                                                </g>

                                            )
                                        })
                                    }
                                </Stack>
                            </motion.g>)
                        }
                    </Drag>
                    <g>
                        <VisAxes
                            parentDimensions={{ ...props }}
                            width={width}
                            height={height}
                            axisWidth={0}
                            hScale={xAxis}
                            vScale={absY} />
                    </g>
                </svg>
            </VisTooltip>
        }</ParentSize >
    </>
}