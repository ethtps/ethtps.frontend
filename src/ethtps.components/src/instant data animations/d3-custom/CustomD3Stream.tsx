import * as d3 from 'd3'
import { useEffect, useRef, useState } from "react"
import { Axis, makeInteractive, useD3Axis, useD3Scale, useXAxisBounds, useYAxisBounds } from '../..'
import { IInstantDataAnimationProps } from '../../..'


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
    const xRef = useRef<any>(null)
    const yRef = useRef<any>(null)
    const [mountTime, setMountTime] = useState<number>()
    useEffect(() => {
        setMountTime(Date.now())
        console.clear()
    }, [])

    const xBounds = useXAxisBounds(props.timeInterval)
    const yBounds = useYAxisBounds(newestData, dataType)
    const xAxis = useD3Scale(xBounds, [0, innerWidth])
    const yAxis = useD3Scale(yBounds, [0, innerHeight])
    const y = useD3Axis(yAxis, d3.axisRight, yRef, padding, margins, 'y')

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