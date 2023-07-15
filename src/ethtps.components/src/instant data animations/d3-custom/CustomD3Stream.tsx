import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useEffect, useRef, useState } from "react"
import { makeInteractive, useDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { FrequencyLimiter } from '../../../../ethtps.data/src'
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
    const [liveData, columns] = useAccumulator(newestData, maxEntries ?? 10, dataType, providerData, refreshInterval)
    const [mountTime, setMountTime] = useState<number>(Date.now())
    useDebugMeasuredEffect(() => {
        if (!FrequencyLimiter.canExecute('d3 stream update')) return
        const svg = svgRef.current
        if (!svgRef.current) return
        const s = d3.select(svg)
        s.selectChildren().remove()

        const dates = Array.from(d3.group(liveData.map(x => x.x), d => d).keys()).map(x => new Date(x))
        type T = {
            name: string,
            date: Date,
            value: number
        }
        const data = {
            dates,
            series: columns.flatMap((providerName, i) => {
                return liveData.filter(x => x.z === providerName).map(x => ({
                    name: providerName,
                    date: new Date(x.x),
                    value: liveDataPointExtractor(x, dataType ?? ETHTPSDataCoreDataType.TPS) ?? 0
                }) as T)
            })
        }
        const xe = d3.extent(data.dates)
        if (!xe[0] || !xe[1]) return
        const x = d3.scaleTime()
            .domain([xe[1], xe[0]])
            .range([(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0), innerWidth])
        const overlap = 0.1
        const max = (d3.max(data.series, d => d.value) ?? 0) * (1 + overlap)
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
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y0(d => y(-d.value))
            .y1(d => y(d.value))
            .curve(d3.curveCatmullRom)

        const getColor = (i: number) => {
            let c = d3.color(d3.schemePuBuGn[5][i % 5])
            if (c) c.opacity = 0.2
            return c?.formatHex8() ?? '#ddd'
        }
        /*
                const q = d3.rollup(
                    d3.range(data.dates.length),
                    (i: number[]) => i,
                    (i: number) => x(data.dates[i]),
                    (i: number) => 1)
        */
        const stacks = d3.stack<T>()
            .keys(d3.union(data.series.map(d => d.name)))
            .value((g, k) => g.value)
            .order(d3.stackOrderInsideOut)
            .offset(d3.stackOffsetWiggle)
            (data.series)

        console.clear()
        console.log(stacks)
        console.log(data.series)

        const group = s.append("g")
            .selectAll('path')
            .data(data.series)
            .join('path')
            .attr("fill", (d, i) => getColor(i))
            .attr("d", d => area(data.series.filter(x => x.name === d.name)))


    }, 'new stream point', [liveData, columns, dataType, providerData, refreshInterval, mountTime])

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