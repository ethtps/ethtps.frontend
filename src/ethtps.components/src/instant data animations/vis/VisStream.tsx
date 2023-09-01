import { useSize } from '@chakra-ui/react-use-size'
import { animated, useSpring } from '@react-spring/web'
import { Drag } from '@visx/drag'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { Stack } from '@visx/shape'
import { Zoom } from '@visx/zoom'
import * as d3 from 'd3'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ExpandType, StreamchartQuickActions, Vector2D, VisTooltip, WithMargins, binaryConditionalRender, conditionalRender, darkenColorIfNecessary, getD3Scale, getXAxisBounds, makeInteractive, openNewTab, useColors, useQueryStringAndLocalStorageBoundState, useYAxisBounds } from '../../..'
import { FrequencyLimiter, LiveDataAccumulator, TimeIntervalToSeconds, logToOverlay } from '../../../../ethtps.data/src'
import { IInstantDataAnimationProps } from '../InstantDataAnimationProps'
import { liveDataPointExtractor, measure, minimalDataPointToLiveDataPoint, useChartTranslations, useGroupedDebugMeasuredEffect } from '../hooks'
import { VisAxes } from './axes/VisAxes'
import { motion, useAnimate, animate as motionAnimate, useSpring as useMotionSpring, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'
import { Vector } from 'three'
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, IconFocus2, IconHome, IconInfoSquare, IconWindowMaximize } from '@tabler/icons-react'
import { Box, Button, Divider, Tooltip, Text, Kbd, VStack, HStack } from '@chakra-ui/react'
import { useNormalizeButton } from './NormalizeButton'
import { VisLegend } from './VisLegend'
import { ScrollableG } from '../Scrollable'
import { ProviderPattern } from './patterns/ProviderPattern'

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
    expandType?: ExpandType
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
        animate = true,
        initialData,
        expandType,
        paused
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
        marginRight: 10,
    }, {
        paddingLeft: 10,
        paddingRight: 10,
    })
    const begin = performance.now()
    const normalizeButton = useNormalizeButton()
    const [dragOffset, setDragOffset] = useState<Vector2D>(Vector2D.Zero)
    const [previousDragOffset, setPreviousDragOffset] = useState<Vector2D>(Vector2D.Zero)
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
    const xAxis = useMemo(() => {
        const domain = getXAxisBounds(timeInterval)
        return scaleLinear<number>({
            domain,
            range: [0, width]
        })
    }, [width, dragOffset, timeInterval])

    const getX = useCallback((i: number) => {
        const now = Date.now()
        if (i >= accumulator.all.length) return now
        const e = accumulator.all[i]
        const ks = Object.keys(e)
        const timeAt = e[ks[0]]?.x ?? now
        return xAxis(timeAt)
    }, [xAxis, accumulator])
    const absY = useMemo(() => scaleLinear<number>({
        domain: normalizeButton.normalize ? [0, 1.1] : [-(liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1), liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 1],
        range: [actualHeight, 0]
    }), [actualHeight, accumulator.maxTotal, dataType, normalizeButton.normalize])
    const [lastUpdate, setLastUpdate] = useState(() => Date.now())
    const [msBetweenUpdates, setMsBetweenUpdates] = useState<number>(() => Infinity)
    useGroupedDebugMeasuredEffect(() => {
        if (!newestData) return
        accumulator.insert(newestData)
        setLastUpdate(u => {
            const now = Date.now()
            setMsBetweenUpdates(now - u)
            translateX.set(translateX.get() - (xAxis(now) - xAxis(u)), true)
            return now
        })
    }, 'update', 'data', [newestData, accumulator])
    const { translateX, translateY, negTranslateX, negTranslateY } = useChartTranslations({ paused, xAxis, width })
    const [autoResetPosition, setAutoResetPosition] = useState(false)
    const [tooltipData, setTooltipData] = useState<JSX.Element>()
    const resetPosition = useCallback(() => {
        setPreviousDragOffset(dragOffset)
        setDragOffset(Vector2D.Zero())
        translateX.set(0)
        translateY.set(0)
    }, [dragOffset, translateX, translateY])
    return <>
        <ParentSize>{({ width, height }) =>
            <Box
                role={'streamchart'}>
                <VisTooltip
                    forwardRef={svgRef}
                    content={tooltipData}
                    width={width}
                    height={height}>
                    <Box
                        role={'streamchart'}
                        position={'absolute'}
                        right={0}>
                        <div

                            role={'streamchart'}
                            style={{
                                display: 'flex',
                                flexGrow: 2,
                                flexDirection: 'column',
                            }}>
                            <StreamchartQuickActions
                                normalizeButton={normalizeButton}
                                onReset={resetPosition}
                                showResetPositionButton={((dragOffset?.x !== 0 || dragOffset.y !== 0) && previousDragOffset?.subtract?.(dragOffset).magnitude() > 75)}
                                showNewTabButton={expandType !== ExpandType.Float} />
                        </div>
                    </Box>
                    <motion.svg
                        ref={svgRef}
                        role={'streamchart'}
                        onDoubleClick={resetPosition}
                        width={width}
                        height={height}>
                        <PatternCircles
                            id="mustard"
                            height={40}
                            width={40}
                            radius={5}
                            fill="#036ecf"
                            complement />
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
                        {accumulator.distinctProviders.map((p, i) => (<ProviderPattern
                            provider={p}
                            radius={10}
                            width={20}
                            height={20} />))}
                        <motion.rect
                            width={width}
                            height={height}
                            fill={colors.chartBackground}
                            rx={14} />

                        <VisAxes
                            tx={translateX}
                            ty={translateY}
                            parentDimensions={{ ...props }}
                            width={width}
                            height={height}
                            axisWidth={0}
                            hScale={xAxis}
                            vScale={absY} >
                            <svg
                                width={width}
                                height={height}
                                style={{
                                    marginLeft: 50,
                                    marginTop: 50,
                                }}>
                                <Drag
                                    key={'streamdrag'}
                                    resetOnStart={autoResetPosition}
                                    width={width}
                                    height={height}
                                    restrict={{
                                        xMin: translateX.get(),
                                        yMax: 0,
                                        yMin: 0
                                    }}
                                    onDragMove={(offset) => {
                                        if (FrequencyLimiter.canExecute('stream drag move'), 100) {
                                            translateY.set(offset.dy - previousDragOffset.y)
                                            translateX.set(offset.dx - previousDragOffset.x)
                                        }
                                    }}
                                    snapToPointer={false}
                                    onDragEnd={(offset) => {
                                        setDragOffset(new Vector2D(offset.dx, offset.dy))
                                        if (!autoResetPosition) {
                                            let x = offset.dx - previousDragOffset.x
                                            translateX.set(x, false)
                                            const y = offset.dy - previousDragOffset.y
                                            translateY.set(y, false)
                                            //xOffset.set(x, false)
                                            //yOffset.set(y, false)
                                            return
                                        }
                                        setDragOffset(Vector2D.Zero())
                                        translateX.set(offset.dx, false)
                                        //xOffset.set(0)
                                        translateY.set(offset.dy, false)
                                        //yOffset.set(0)
                                    }}

                                >
                                    {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
                                        <>
                                            <motion.g
                                                cx={x}
                                                cy={y}
                                                style={{
                                                    translateX: (false ? dx - previousDragOffset.x : translateX),
                                                    translateY: (false ? dy - previousDragOffset.y : translateY),
                                                }}
                                                onMouseMove={dragMove}
                                                onMouseUp={dragEnd}
                                                onMouseDown={dragStart}
                                                onTouchStart={dragStart}
                                                onTouchMove={dragMove}
                                                onTouchEnd={dragEnd}>
                                                <motion.rect
                                                    style={{
                                                        translateX: negTranslateX,
                                                        translateY: negTranslateY,
                                                        cursor: 'grab'
                                                    }}
                                                    key={'drag area'}
                                                    /*
                                                    strokeWidth={1}
                                                    stroke={colors.primaryContrast}
                                                    stroke-dasharray={"4"}*/
                                                    width={width}
                                                    height={height}
                                                    fill={'transparent'}
                                                    rx={14} />
                                                <Stack<number[], number>
                                                    data={layers}
                                                    keys={keys}
                                                    color={colorScale}
                                                    offset={normalizeButton.offset}
                                                    curve={d3.curveCatmullRom.alpha(0.8)}
                                                    x={(_, i) => getX(i) ?? 0}
                                                    y0={d => absY(d[0])}
                                                    y1={d => absY(d[1])}
                                                >
                                                    {({ stacks, path }) =>
                                                        stacks.map((stack) => {
                                                            // Alternatively use renderprops <Spring to={{ d }}>{tweened => ...}</Spring>
                                                            const pathString = path(stack) || ''
                                                            const tweened = animate ? useSpring({ pathString }) : { pathString }
                                                            const color = colorScale(stack.key)
                                                            const pattern = `${accumulator.distinctProviders[stack.key]}-pattern` // 'PP-TEST'//patternScale(stack.key)
                                                            return (
                                                                <g
                                                                    key={`series-${stack.key}`}>
                                                                    <animated.path d={tweened.pathString} fill={color} />
                                                                    <animated.path d={tweened.pathString} fill={`url(#${pattern})`} />
                                                                </g>
                                                            )
                                                        })
                                                    }
                                                </Stack>
                                            </motion.g>)
                                        </>
                                    )}
                                </Drag>
                            </svg>
                        </VisAxes>
                    </motion.svg>
                </VisTooltip>
            </Box>
        }
        </ParentSize>
    </>
}