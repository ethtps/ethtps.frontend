import * as d3 from 'd3'
import { useCallback, useMemo, useRef, useState } from "react"
import { Axis, getD3Scale, getDataXAxisBounds, liveDataPointExtractor, makeInteractive, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { GenericDictionary, LiveDataAggregator, LiveDataPoint, logToOverlay } from '../../../../ethtps.data/src'

const aggregator = new LiveDataAggregator()

/**
 * Junk data generator function
 */
const f = (x: number): number => 0// Math.sin(x / 10 + Math.random())

export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        maxEntries,
        dataPoints = 250
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
    const pixelsPerPoint = useMemo(() => innerWidth / maxEntries, [innerWidth, maxEntries])

    const [data, setData] = useState<GenericDictionary<LiveDataPoint>[]>(new Array<GenericDictionary<LiveDataPoint>>(maxEntries))
    const xBounds = useMemo(() => getDataXAxisBounds(data), [data])

    const xAxis = useMemo(() =>
        getD3Scale(xBounds,
            [0, innerWidth]),
        [xBounds, innerWidth])

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
        setData((d) => {
            let dict: GenericDictionary<LiveDataPoint> = {}
            const k = [...Object.keys(aggregator.all)]
            for (let i = 0; i < k.length; i++) {
                const x = aggregator.all[k[i]]
                if (x?.data) dict = Object.assign(dict, { [k[i]]: minimalDataPointToLiveDataPoint(x.data, k[i]) })
            }
            const c = d.length < maxEntries ? [...d] : [...d.slice(maxEntries)]
            return [...c, { ...dict }]
        })
    }, 'update', 'data', [newestData, aggregator, maxEntries])
    measure(() => {
        if (!areaRef.current || !data) return

        const testData = data.map(d => d?.['Polygon']).filter(x => !!x?.x).sort((a, b) => a.x! - b.x!)

        const extent = d3.extent(testData, (d: LiveDataPoint) => liveDataPointExtractor(d, dataType) ?? 0)
        extent[0] = -extent[1]!
        logToOverlay({
            name: 'test data info',
            details: `N=${testData?.length}; [${extent?.[0]?.toFixed(2)}, ${extent?.[1]?.toFixed(2)}]`,
            level: testData?.length > 0 ? 'info' : 'warn'
        })
        const yScale = d3.scaleLinear().domain(extent as [number, number]).nice().range([0, innerHeight])

        const area = d3.area<LiveDataPoint>()
            .x((d: LiveDataPoint) => xAxis(d?.x!))
            .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
            .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
            .curve(d3.curveCatmullRom.alpha(0.5))

        const selectArea = () => d3.select(areaRef?.current)
        selectArea().selectAll('*').remove()
        selectArea().append('path')
            .attr('d', area(testData))

        selectArea()
            .attr('fill', 'blue')
            .attr('fill-opacity', 0.5)
            .attr('stroke', 'steelblue')
    }, 'transform', 'data', [data, dataType, innerWidth, innerHeight, xAxis, yAxis, areaRef.current, max, pixelsPerPoint, aggregator.all, aggregator.maxTotal])
    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={width}
            height={height}>
            <g ref={areaRef}
                style={{
                    transform: `translate(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px,${(padding?.paddingTop ?? 0) + (margins?.marginTop ?? 0)}px)`
                }}></g>
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