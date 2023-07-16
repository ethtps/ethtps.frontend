import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Axis, dataExtractor, getD3Scale, getXAxisBounds, liveDataPointExtractor, makeInteractive } from '../..'
import { IInstantDataAnimationProps } from '../../..'
import { LiveDataAggregator, LiveDataPoint, logToOverlay } from '../../../../ethtps.data/src'

const aggregator = new LiveDataAggregator()

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
    const xBounds = useMemo(() => getXAxisBounds(props.timeInterval), [props.timeInterval])
    const xAxis = useMemo(() => getD3Scale(xBounds, [0, innerWidth]), [xBounds, innerWidth])
    const [max, setMax] = useState<Partial<LiveDataPoint>>()
    const yGen = useCallback(() => d3.scaleLinear().domain([-(liveDataPointExtractor(max, dataType) ?? 0), liveDataPointExtractor(max, dataType) ?? 1]).nice().range([0, innerHeight]), [dataType, innerHeight, max])
    const yAxis = yGen()
    useEffect(() => {
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
            logToOverlay({
                name: 'max',
                details: JSON.stringify(m)
            })
            return m
        })
    }, [dataType, newestData])
    return <>
        <svg
            ref={svgRef}
            style={{
                ...margins,
                ...padding
            }}
            width={width}
            height={height}>
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