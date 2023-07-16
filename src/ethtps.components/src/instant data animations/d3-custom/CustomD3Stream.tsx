import * as d3 from 'd3'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Axis, getD3Scale, getXAxisBounds, liveDataPointExtractor, makeInteractive, measure, useGroupedDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { GenericDictionary, LiveDataAggregator, LiveDataPoint, logToOverlay } from '../../../../ethtps.data/src'

const aggregator = new LiveDataAggregator()

export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        maxEntries,
        dataPoints = 100
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
    const svgRef = useRef<any>(null)
    const areaRef = useRef<any>(null)

    const xBounds = useMemo(() => getXAxisBounds(props.timeInterval), [props.timeInterval])
    const [data, setData] = useState<GenericDictionary<LiveDataPoint>[]>(new Array<GenericDictionary<LiveDataPoint>>(maxEntries))
    const xAxis = useMemo(() => getD3Scale([0, maxEntries], [0, innerWidth]), [xBounds, innerWidth])
    const [max, setMax] = useState<Partial<LiveDataPoint>>()
    const yGen = useCallback(() => d3.scaleLinear().domain([-(liveDataPointExtractor(max, dataType) ?? 0), liveDataPointExtractor(max, dataType) ?? 1]).nice().range([0, innerHeight]), [dataType, innerHeight, max])
    const yAxis = yGen()
    useGroupedDebugMeasuredEffect(() => {
        if (newestData) {
            aggregator.updateMultiple(newestData)
        }
        setMax(m => {
            if (!m) {
                const cpy = new LiveDataPoint()
                cpy.tps = aggregator.maxTotal.tps
                cpy.gps = aggregator.maxTotal.gps
                return cpy
            }
            if (!m.compare!(aggregator.maxTotal)) {
                if (m.tps !== aggregator.maxTotal.tps) {
                    m.tps = aggregator.maxTotal.tps
                }
                if (m.gps !== aggregator.maxTotal.gps) {
                    m.gps = aggregator.maxTotal.gps
                }
            }
            return m
        })
        setData(d => {
            const dict: GenericDictionary<LiveDataPoint> = {}
            const k = Object.keys(aggregator.all)
            for (let i = 0; i < k.length; i++) {
                const x = aggregator.all[k[i]]
                const point = new LiveDataPoint()
                point.tps = x.data?.tps ?? 0
                point.gps = x.data?.gps ?? 0
                point.x = k.length - 1 // To change
                dict[k[i]] = point
            }
            return [...d.slice(0, d.length), dict]
        })
    }, 'update', 'data', [dataType, newestData])
    useEffect(() => {
        setData(d => {
            for (let i = 0; i < maxEntries; i++) {
                const k = 'auto'
                d[i] = {}
                d[i][k] = new LiveDataPoint()
                const x = d[i][k]
                x.tps = Math.random() * 100
                x.gps = Math.random() * 100
                x.x = maxEntries - 1 - i
            }
            return d
        })
    }, [])
    measure(() => {
        if (!areaRef.current || !data) return

        const testData = data.map(d => d['auto']).filter(x => !!x?.x).sort((a, b) => a.x! - b.x!)

        const extent = d3.extent(testData, (d: LiveDataPoint) => liveDataPointExtractor(d, dataType) ?? 0)
        extent[0] = -extent[1]!
        logToOverlay({
            name: 'test data info',
            details: `N=${testData?.length}; [${extent?.[0]?.toFixed(2)}, ${extent?.[1]?.toFixed(2)}]`,
            level: testData?.length > 0 ? 'info' : 'warn'
        })
        const yScale = d3.scaleLinear().domain(extent as [number, number]).nice().range([0, innerHeight])
        const xScale = d3.scaleLinear()
            .domain(d3.extent(testData.map(x => x.x ?? 0)) as [number, number])
            .nice()
            .range([0, innerWidth])

        const area = d3.area<LiveDataPoint>()
            .x((d: LiveDataPoint) => xScale(d?.x!))
            .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
            .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
            .curve(d3.curveBasis)

        const selectArea = () => d3.select(areaRef?.current)
        selectArea().selectAll('*').remove()
        selectArea().append('path')
            .attr('d', area(testData))

        selectArea()
            .attr('fill', 'blue')
            .attr('fill-opacity', 0.5)
            .attr('stroke', 'steelblue')
    }, 'transform', 'data', [dataType, data, areaRef.current, innerWidth, innerHeight, max, maxEntries])
    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={width}
            height={height}>
            <g ref={areaRef}></g>
            <Axis
                sx={{
                    transform: `translateX(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px)`
                }}
                orientation={d3.axisBottom}
                axis={xAxis}
                name={'x'}
                padding={padding}
                margins={margins}
            />
            <Axis
                sx={{
                    transform: `translate(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px, ${(padding?.paddingTop ?? 0) + (margins?.marginTop ?? 0)}px)`
                }}
                orientation={d3.axisRight}
                axis={yAxis}
                name={'y'}
                padding={padding}
                margins={margins}
            />
        </svg>
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