/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Stack } from '@visx/shape'
import { scaleLinear, scaleOrdinal } from '@visx/scale'
import { transpose } from 'd3-array'
import { animated, useSpring } from '@react-spring/web'
import { BACKGROUND, BUMPS_PER_LAYER, Patterns, SAMPLES_PER_LAYER, StreamStack, colorScale, getY0, getY1, keys, useForceUpdate, xScale, yScale } from './'
import { generateData } from './'
import { StreamGraphProps } from '..'
import { Progress } from '@chakra-ui/react'
import { RandomDataGenerator } from '@/services'

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
