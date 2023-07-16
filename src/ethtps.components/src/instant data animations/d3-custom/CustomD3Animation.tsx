import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useEffect, useRef, useState } from "react"
import { makeInteractive } from '../../'
import { IInstantDataAnimationProps } from '../../..'
import { liveDataPointExtractor } from '../hooks'
import { useAccumulator } from '../streaming'

export function CustomD3Animation(props: IInstantDataAnimationProps) {
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
        marginRight: 10,
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
    const [liveData, columns] = useAccumulator(newestData, maxEntries ?? 10, dataType, providerData, refreshInterval)
    const [mountTime, setMountTime] = useState<number>(Date.now())

    useEffect(() => {
        const svg = svgRef.current
        if (!svgRef.current) return
        const s = d3.select(svg)
        s.selectChildren().remove()

        const dates = Array.from(d3.group(liveData.map(x => x.x), d => d).keys()).map(x => new Date(x as number))
        type T = [Date, number]
        const data = {
            dates,
            series: columns.map((providerName, i) => {
                return {
                    name: providerName,
                    values: liveData.filter(x => x.z === providerName).map(x => [new Date(x.x!), liveDataPointExtractor(x, dataType ?? ETHTPSDataCoreDataType.TPS) ?? 0] as T)
                }
            })
        }
        const overlap = 1
        const xe = d3.extent(data.dates)
        if (!xe[0] || !xe[1]) return
        const x = d3.scaleTime()
            .domain([xe[0], xe[1]])
            .range([(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0), innerWidth])
        const y = d3.scalePoint()
            .domain(data.series.map(d => d.name))
            .range([0, innerHeight - ((padding?.paddingBottom ?? 0) + (margins?.marginBottom ?? 0))])
        const z = d3.scaleLinear()
            .domain([0, d3.max(data.series, d => d3.max(d.values, q => q[1])!)!]).nice()
            .range([0, -overlap * y.step()])

        const xAxis = (g: any) => g
            .attr("transform", `translate(${bounds[0]},${innerHeight - margins?.marginBottom! - padding?.paddingBottom! - 50})`)
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

        const group = s.append("g")
            .selectAll("g")
            .data(data.series)
            .join("g")
            .attr("transform", (d, i) => `translate(0,${y(d.name)! + 1})`)
            .attr("cursor", "grab")

        const area = d3.area<T>()
            .curve(d3.curveBasis)
            .defined(d => !isNaN(d[1]))
            .x((d, i) => x(data.dates[i]))
            .y0(0)
            .y1(d => z(d[1]))
        const getColor = (i: number) => {
            let c = d3.color(d3.schemePiYG[11][i % 11])
            if (c) c.opacity = 0.2
            return c?.formatHex8() ?? '#ddd'
        }
        group.append("path")
            .attr("fill", (d, i) => getColor(i))
            .attr("d", d => area(d.values))

        const line = area.lineY1()

        group.append("path")
            .attr("fill", 'none')
            .attr("stroke", 'black')
            .attr("d", d => line(d.values))

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