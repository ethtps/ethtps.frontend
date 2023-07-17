import * as d3 from 'd3'
import { ZoomTransform } from 'd3'
import { useCallback, useMemo, useRef, useState } from "react"
import { Axis, Vector2D, addGrid, dataExtractor, getD3Scale, getXAxisBounds, liveDataPointExtractor, makeInteractive, measure, minimalDataPointToLiveDataPoint, useGroupedDebugMeasuredEffect } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { GenericDictionary, LiveDataAggregator, LiveDataPoint, logToOverlay } from '../../../../ethtps.data/src'

const aggregator = new LiveDataAggregator()

/**
 * Junk data generator function
 */
const f = (x: number): number => 0// Math.sin(x / 10 + Math.random())

const duration = 5000
let xOffset = 0

export function CustomD3Stream(props: IInstantDataAnimationProps) {
    const {
        newestData,
        providerData,
        dataType,
        refreshInterval,
        timeInterval,
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
    const gridRef = useRef<any>(null)
    const pixelsPerPoint = useMemo(() => innerWidth / maxEntries, [innerWidth, maxEntries])
    const [data, setData] = useState<GenericDictionary<LiveDataPoint>[]>(new Array<GenericDictionary<LiveDataPoint>>(maxEntries))
    const xBounds = useMemo(() => getXAxisBounds(timeInterval), [timeInterval])

    const xAxis = useMemo(() =>
        getD3Scale(xBounds,
            [0, innerWidth]),
        [xBounds, innerWidth])

    const yGen = useCallback(() => d3.scaleLinear().domain([-(liveDataPointExtractor(aggregator.maxTotal, dataType) ?? 0), liveDataPointExtractor(aggregator.maxTotal, dataType) ?? 1]).nice().range([0, innerHeight]), [dataType, innerHeight, aggregator.maxTotal])
    const yAxis = yGen()
    logToOverlay({
        name: 'y axis info',
        details: `Domain: [${yAxis?.domain()}]; Range: [${yAxis?.range()}]`
    })
    useGroupedDebugMeasuredEffect(() => {
        if (!newestData) return

        aggregator.updateMultiple(newestData)
        setData((d) => {
            let dict: GenericDictionary<LiveDataPoint> = {}
            const k = [...Object.keys(aggregator.all)]
            for (let i = 0; i < k.length; i++) {
                const x = aggregator.all[k[i]]
                if (x?.data) dict = Object.assign(dict, { [k[i]]: minimalDataPointToLiveDataPoint(x.data, k[i]) })
            }
            const c = d.length < maxEntries ? [...d] : [...d.slice(maxEntries)]
            localStorage.setItem('customd3streamdata', JSON.stringify([...c, { ...dict }]))
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
        const yScale = d3.scaleLinear().domain(extent as [number, number])
            .nice()
            .range([0, innerHeight])
        const area = d3.area<LiveDataPoint>()
            .x((d: LiveDataPoint) => xAxis(d?.x!))
            .y0((d: LiveDataPoint) => yScale(-liveDataPointExtractor(d, dataType)!))
            .y1((d: LiveDataPoint) => yScale(liveDataPointExtractor(d, dataType)!))
            .curve(d3.curveCatmullRom.alpha(0.5))

        const selectArea = () => d3.select(areaRef?.current)
        selectArea().selectAll('*').remove()
        selectArea().append('path')
            .attr('d', area(testData.slice(0, testData.length - 1)))

        if (testData.length >= 2) {
            const p2 = testData[testData.length - 2] //p[n-2]
            const p1 = testData[testData.length - 1] //p[n-1]

            if (!dataExtractor(p1?.y, dataType) || !dataExtractor(p2?.y, dataType)) return
            const getCoordinates = (d: LiveDataPoint) => ({ x: xAxis(d.x!), y: yScale(liveDataPointExtractor(d, dataType)!) }) as Vector2D
            const getInverseCoordinates = (d: LiveDataPoint) => ({ x: xAxis(d.x!), y: yScale(-liveDataPointExtractor(d, dataType)!) }) as Vector2D // y scale is not somethingmorphic - y(-x) != -y(x) because we're drawing the chart relative to the vertical midpoint
            const p2Top = getCoordinates(p2)
            const p1Top = getCoordinates(p1)
            const p2Bottom = getInverseCoordinates(p2)
            const p1Bottom = getInverseCoordinates(p1)
            const d3interpolator = d3.interpolateNumber
            const interpolator = {
                top: {
                    x: d3interpolator(p2Top.x, p1Top.x),
                    y: d3interpolator(p2Top.y, p1Top.y)
                },
                bottom: {
                    x: d3interpolator(p2Bottom.x, p1Bottom.x),
                    y: d3interpolator(p2Bottom.y, p1Bottom.y)
                }
            }
            function toPoint(v: Vector2D) {
                return { x: v.x, y: v.y } as Vector2D
            }

            const areaPoints = {
                top: [p2Top, p1Top].map(toPoint),
                bottom: [p2Bottom, p1Bottom].map(toPoint)
            }
            const line = d3.line<Vector2D>()
                .x((d: any) => d.x)
                .y((d: any) => d.y)
                .curve(d3.curveCatmullRom.alpha(0.5))

            type AreaPointPair = {
                initial: Vector2D,
                final: Vector2D
            }
            // interpolate area between p2 and p_i
            const a = d3.area<AreaPointPair>()
                .x0((d, i) => d.initial.x)
                .y0((d, i) => d.initial.y)
                .x1((d, i) => d.final.x)
                .y1((d, i) => d.final.y)
                .curve(d3.curveCatmullRom.alpha(0.5))

            logToOverlay({
                name: 'i_top(0.5)',
                details: `[x: ${interpolator.top.x(0.5)}, y: ${interpolator.top.y(0.5)}]`,
                level: 'info'
            })
            logToOverlay({
                name: 'i_bottom(0.5)',
                details: `[x: ${interpolator.bottom.x(0.5)}, y: ${interpolator.bottom.y(0.5)}]`,
                level: 'info'
            })

            selectArea().append('path')
                .transition()
                .duration(duration)
                .ease(d3.easeQuad)
                .attrTween('fill-opacity', () => (t) => d3.interpolateNumber(0.3, 0.5)(t).toString())
                .attrTween('d', () => (t) => a([
                    {
                        initial: p2Top,
                        final: {
                            x: interpolator.top.x(t),
                            y: interpolator.top.y(t)
                        } as Vector2D,
                    },
                    {
                        initial: p2Bottom,
                        final: {
                            x: interpolator.bottom.x(t),
                            y: interpolator.bottom.y(t)
                        } as Vector2D,
                    }
                ]) ?? '')

            /*
                        selectArea().append('path')
                            .transition()
                            .attr('stroke', 'red')
                            .attr('stroke-width', 5)
                            .attr('fill', 'red')
                            .attr('fill-opacity', 0.5)
                            .duration(duration)
                            .attrTween('d', () => (t) => line([
                                p2Top, {
                                    x: interpolator.top.x(t),
                                    y: interpolator.top.y(t)
                                } as Vector2D
                            ]) ?? '')
                        /*
                        .attrTween('d', () => (t) => line([
                            p2Bottom, {
                                x: interpolator.bottom.x(t),
                                y: interpolator.bottom.y(t)
                            } as Vector2D
                        ]) ?? '')*/

        }
        const yCSS = `${(padding?.paddingTop ?? 0) + (margins?.marginTop ?? 0)}px`
        const genCSS = (x: number) => `translate(${x + (padding?.paddingLeft ?? 0)}px,${yCSS})`
        const interpolator = d3.interpolateTransformCss(genCSS(xOffset), genCSS(xOffset - pixelsPerPoint))
        /*
        const transform = d3.zoom()
            .duration(duration / 2)
            .call(selectArea())
            .translateBy(selectArea(), xOffset, 0)*/
        // .transform(selectArea(), new ZoomTransform(1, -xOffset, 0))
        selectArea().call(d3.zoom(), new ZoomTransform(1, -xOffset, 0))
        // transform()

        logToOverlay({
            name: 'xOffset',
            details: xOffset,
            level: 'info'
        })
        //after transition
        selectArea()
            .attr('stroke-width', 0)
            .attr('fill', 'blue')
            .attr('fill-opacity', 0.5)
    }, 'transform', 'data', [data, dataType, innerWidth, innerHeight, xAxis, areaRef.current, pixelsPerPoint, aggregator.all, aggregator.maxTotal])
    measure(() => {
        if (!gridRef.current) return

        addGrid(d3.select(gridRef.current), xAxis, yAxis, innerHeight, innerWidth, 12, padding, margins)
    }, 'update', 'grid', [innerWidth, innerHeight, xAxis, yAxis, gridRef.current, padding, margins])
    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={width}
            height={height}>
            <g ref={gridRef}
                style={{
                    transform: `translate(${(padding?.paddingLeft ?? 0) + (margins?.marginLeft ?? 0)}px,${(padding?.paddingTop ?? 0) + (margins?.marginTop ?? 0)}px)`
                }}></g>
            <svg ref={areaRef}></svg>
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