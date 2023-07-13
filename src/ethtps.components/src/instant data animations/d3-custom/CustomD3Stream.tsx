import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useEffect, useRef, useState } from "react"
import { makeInteractive } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { liveDataPointExtractor } from '../hooks'
import { useAccumulator } from '../streaming'

export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        maxEntries,
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
        marginBottom: 10
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
    useEffect(() => {
        setMountTime(Date.now())
    }, [])
    const [liveData, columns, lastValues] = useAccumulator(newestData, maxEntries ?? 10, dataType, providerData, refreshInterval)
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
        const xe = d3.extent(data.dates)
        if (!xe[0] || !xe[1]) return
        const x = d3.scaleTime()
            .domain([xe[1], xe[0]])
            .range([(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0), innerWidth])
        const overlap = 0.1
        const max = d3.max(data.series, d => d3.max(d.values, q => q[1])!)! * (1 + overlap)
        const y = d3.scaleLinear()
            .domain([-max, max]).nice()
            .range([0, innerHeight])

        const xAxis = (g: any) => g
            .attr("transform", `translate(${bounds[0]},${innerHeight - 15 - (margins?.marginTop ?? 0) - (margins?.marginBottom ?? 0) - (padding?.paddingTop ?? 0) - (padding?.paddingBottom ?? 0)})`)
            .call(d3.axisBottom(x)
                .ticks(10)
                .tickSize(12))

        const yAxis = (g: any) => g
            .attr("transform", `translate(${bounds[0]},0)`)
            .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
            .call((g: any) => g.select(".domain").remove())

        s.append("g")
            .call(xAxis)

        s.append("g")
            .call(yAxis)

        const area = d3.area<T>()
            .defined(d => !isNaN(d[1]))
            .x(d => x(d[0]))
            .y0(d => y(-d[1]))
            .y1(d => y(d[1]))
            .curve(d3.curveCatmullRom)

        const getColor = (i: number) => {
            let c = d3.color(d3.schemePiYG[11][i % 11])
            if (c) c.opacity = 0.2
            return c?.formatHex8() ?? '#ddd'
        }

        const group = s.append("g")
            .selectAll('path')
            .data(data.series)
            .join('path')
            .attr("fill", (d, i) => getColor(i))
            .attr("d", d => area(d.values))

    }, [newestData, maxEntries, dataType, providerData, refreshInterval, width, height, padding, margins, viewBox, bounds, innerWidth, innerHeight, mountTime])

    useEffect(() => {
        const svg = svgRef.current
        if (!svgRef.current || !svg) return
        const s = d3.select(svg)
        //addZoom(s, viewBox, [1.25, 0.75])
        //addDrag(s)
    }, svgRef.current)
    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={innerWidth}
            height={innerHeight}>

        </svg >
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