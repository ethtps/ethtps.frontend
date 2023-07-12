import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useEffect, useRef, useState } from "react"
import { InstantDataAnimationProps } from "../InstantDataAnimationProps"
import { liveDataPointExtractor } from '../hooks'
import { useAccumulator } from '../streaming'
import { useHorizontalScale } from './Hooks'

export function CustomD3Animation({
    width = 500,
    height = 500,
    newestData,
    maxEntries,
    dataType,
    providerData,
    refreshInterval,
    verticalPadding = 10,
    horizontalPadding = 20,
    timeInterval
}: Partial<InstantDataAnimationProps>) {
    const svgRef = useRef<any>(null)
    useEffect(() => {
        setMountTime(Date.now())
    }, [])
    const [liveData, columns, lastValues] = useAccumulator(newestData, maxEntries ?? 10, dataType, providerData, refreshInterval)
    const xScale = useHorizontalScale(liveData, dataType ?? ETHTPSDataCoreDataType.TPS, width, height)
    const [mountTime, setMountTime] = useState<number>(Date.now())
    useEffect(() => {
        const svg = svgRef.current
        if (!svgRef.current) return
        const s = d3.select(svg)
        s.selectChildren().remove()

        const dates = Array.from(d3.group(liveData.map(x => x.x), d => d).keys()).map(x => new Date(x))
        type T = [Date, number]
        const data = {
            dates,
            series: columns.map((providerName, i) => {
                return {
                    name: providerName,
                    values: liveData.filter(x => x.z === providerName).map(x => [new Date(x.x), liveDataPointExtractor(x, dataType ?? ETHTPSDataCoreDataType.TPS) ?? 0] as T)
                }
            })
        }
        const overlap = 4
        const xe = d3.extent(data.dates)
        if (!xe[0] || !xe[1]) return
        const x = d3.scaleTime()
            .domain([xe[0], xe[1]])
            .range([0, width - 2 * horizontalPadding])
        const y = d3.scalePoint()
            .domain(data.series.map(d => d.name))
            .range([verticalPadding, height - verticalPadding])
        const z = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.values, q => q[1])!)!]).nice()
            .range([0, -overlap * y.step()])

        const xAxis = (g: any) => g
            .attr("transform", `translate(0,${height - 2 * verticalPadding})`)
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickSize(12 * 5)
                .tickSizeOuter(0))

        const yAxis = (g: any) => g
            .attr("transform", `translate(${horizontalPadding},0)`)
            .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
            .call((g: any) => g.select(".domain").remove())

        s.append("g")
            .call(xAxis)

        s.append("g")
            .call(yAxis)

        const group = s.append("g")
            .selectAll("g")
            .data(data.series)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${y(d.name)! + 1})`)


        const area = d3.area<T>()
            .curve(d3.curveBasis)
            .defined(d => !isNaN(d[1]))
            .x((d, i) => x(data.dates[i]))
            .y0(0)
            .y1(d => z(d[1]))

        group.append("path")
            .attr("fill", "#ddd")
            .attr("d", d => area(d.values))

        const line = area.lineY1()

        group.append("path")
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("d", d => line(d.values))

    }, [newestData, maxEntries, dataType, providerData, refreshInterval])
    return <>

        <svg
            ref={svgRef}
            style={{
                marginLeft: horizontalPadding,
                marginRight: horizontalPadding,
                marginTop: verticalPadding,
                marginBottom: verticalPadding
            }}
            width={width - 2 * horizontalPadding}
            height={height - 2 * verticalPadding}>

        </svg>
    </>
}

/*
  <g>
                <Axis position={AxisPosition.Top} min={0} max={100} width={width} />
            </g>
            <g>
                <Axis padding={20} position={AxisPosition.Left} min={-TimeIntervalToStreamProps(timeInterval).duration / 1000} max={0} width={70} height={height} marginLeft={10} />
            </g>
*/