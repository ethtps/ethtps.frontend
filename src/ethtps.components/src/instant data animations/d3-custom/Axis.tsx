import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import { useDebugMeasuredEffect } from "../hooks"
import { FrequencyLimiter } from "../../../../ethtps.data/src"

export enum AxisPosition {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right'
}

export function getAxisGenerator(position: AxisPosition) {
    switch (position) {
        case AxisPosition.Top:
            return d3.axisTop
        case AxisPosition.Bottom:
            return d3.axisBottom
        case AxisPosition.Left:
            return d3.axisLeft
        case AxisPosition.Right:
            return d3.axisRight
        default:
            return d3.axisLeft
    }
}

export function getRangeMax(position: AxisPosition, width: number, height: number, padding: number = 0, marginLeft: number = 0) {
    switch (position) {
        case AxisPosition.Top:
            return height + (2 * padding + marginLeft)
        case AxisPosition.Bottom:
            return width - (2 * padding + marginLeft)
        case AxisPosition.Left:
            return height - 2 * padding
        case AxisPosition.Right:
            return height - 2 * padding
    }
}

export function getTranslation(position: AxisPosition, width: number, height: number, padding: number = 0, marginLeft: number = 0) {
    switch (position) {
        case AxisPosition.Top:
            return `translate(${padding + marginLeft},${padding})`
        case AxisPosition.Bottom:
            return `translate(${padding + marginLeft},${height - padding})`
        case AxisPosition.Left:
            return `translate(${padding + marginLeft},${padding})`
        case AxisPosition.Right:
            return `translate(${width - (padding + marginLeft)},${padding})`
    }
}

interface IAxisProps {
    axis?: d3.ScaleLinear<number, number, never>
    width: number
    height?: number
    min: number
    max: number
    interval?: number
    tickCount?: number
    tickFormat?: (value: number) => string
    tickSize?: number
    type?: 'linear' | 'log'
    position: AxisPosition,
    padding?: number
    label?: string
    marginLeft?: number
    labelPosition?: 'left' | 'right' | 'top' | 'bottom'
}

export function Axis({
    width,
    height = 50,
    min,
    max,
    interval = 10,
    tickCount = 10,
    tickFormat = (value: number) => value.toString(),
    tickSize = 5,
    type = 'linear',
    position = AxisPosition.Bottom,
    padding = 20,
    marginLeft = 0,
    label,
    labelPosition = 'bottom'
}: IAxisProps): JSX.Element {
    const ref1 = useRef<any>()
    const [scale, setScale] = useState<d3.AxisScale<number>>()
    useDebugMeasuredEffect(() => {
        setScale(d3.scaleLinear()
            .domain([min, max])
            .range([0, getRangeMax(position, width, height, padding, marginLeft)]))
    }, `${position} scale`, [])
    const action = `${position} axis`
    useDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute(action)) return
        if (!ref1?.current || !scale) return

        setScale(d3.scaleLinear()
            .domain([min, max])
            .range([0, getRangeMax(position, width, height, padding, marginLeft)]))
        const svgElement = d3.select(ref1.current)
        svgElement.select('g').remove()
        svgElement
            .append("g")
            .attr('width', width - 2 * padding - marginLeft)
            .attr('height', height - 2 * padding)
            .attr('transform', getTranslation(position, width, height, padding, marginLeft))
            .call(getAxisGenerator(position)(scale).ticks(tickCount))
    }, action, [min, max, width, height, padding, marginLeft, position, labelPosition, scale])
    return (
        <>
            <svg ref={ref1} width={width} height={height} style={{
                padding,
                marginLeft,
                position: 'absolute',
            }} />
        </>)
}