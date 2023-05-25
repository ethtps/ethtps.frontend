/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Stack } from '@visx/shape'
import { PatternCircles, PatternWaves } from '@visx/pattern'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { transpose } from 'd3-array'
import { animated, useSpring } from '@react-spring/web'
import { useForceUpdate } from './'
import { generateData } from './'
import { StreamGraphProps } from '..'
import { Progress } from '@chakra-ui/react'
import { RandomDataGenerator } from '@/services'

const NUM_LAYERS = 20
const SAMPLES_PER_LAYER = 200
const BUMPS_PER_LAYER = 10
export const BACKGROUND = '#ffdede'

const range = (n: number) => Array.from(new Array(n), (_, i) => i)
const keys = range(NUM_LAYERS)

type Datum = number[]
const getY0 = (d: Datum) => yScale(d[0]) ?? 0
const getY1 = (d: Datum) => yScale(d[1]) ?? 0

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

const Patterns: FC = () => (
    <>
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
    </>
)

const StreamStack: FC<{ stacks: any[], path: any, animate: boolean }> = ({ stacks, path, animate }) => {
    return (
        <>
            {stacks.map((stack) => {
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
            })}
        </>
    )
}

export const VISXStreamChart: FC<StreamGraphProps> = ({ width, height, animate = true }) => {
    const forceUpdate = useForceUpdate()
    const handlePress = () => forceUpdate()
    const [connected, setConnected] = useState(false)

    if (width < 10) return null

    xScale.range([0, width])
    yScale.range([height, 0])

    const [layers, setLayers] = useState(() => transpose<number>(
        keys.map(() => generateData(SAMPLES_PER_LAYER, BUMPS_PER_LAYER)),
    ))

    const [dataProvider, setDataProvider] = useState(new RandomDataGenerator([
        "BTCUSDT",
        "ETHUSDT",
        "BNBUSDT",
        "ADAUSDT",
        "XRPUSDT",
        "DOTUSDT",
    ]))

    useEffect(() => {
        dataProvider.startGeneratingData(0, 5, (dataPoints) => {
            if (!connected) {
                setConnected(true)
            }

            // Convert dataPoints to a map for easy access
            const dataMap = new Map(dataPoints.map(dp => [dp.seriesName, dp.value]))

            setLayers(layers => layers.map((layer, i) => {
                // If we have a new data point for this series, update it
                if (dataMap.has(dataProvider.seriesNames[i])) {
                    const newDataPoint = dataMap.get(dataProvider.seriesNames[i])!
                    return [newDataPoint, ...layer.slice(0, -1)]  // Remove the first data point, add the new one at the end
                }
                // Otherwise, use the old data
                return layer
            }))
        })
    }, [dataProvider, connected])

    return (
        <>
            <Progress size='xs' isIndeterminate={!connected} />
            <svg width={width} height={height}>
                <Patterns />
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
                        {props => <StreamStack {...props} animate={animate} />}
                    </Stack>
                </g>
            </svg>
            <Progress size='xs' isIndeterminate={!connected} />
        </>
    )
}
