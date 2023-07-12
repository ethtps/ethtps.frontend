import { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { LiveDataPoint, liveDataPointExtractor } from '..'

export function useHorizontalScale(data: LiveDataPoint[] | undefined,
    dataType: ETHTPSDataCoreDataType | undefined,
    chartWidth: number,
    chartHeight: number,
    marginBottom: number = 0) {
    const [xDomain, setXDomain] = useState<[number, number]>()
    const xScale = useLinearScale(xDomain, [0, chartWidth])
    const xScaleRef = useRef<any>()
    useEffect(() => {
        if (!data || !xDomain) return
        const xd =
            d3.extent(data, (d) => liveDataPointExtractor(d, dataType))
        if (xd[0] !== xDomain[0] || xd[1] !== xDomain[1]) {
            if (!!xd[0] && !!xd[1]) {
                setXDomain(xd)
            }
        }
    }, [data, chartHeight, marginBottom, dataType])
    useEffect(() => {
        if (!xScaleRef.current || !xScale) return
        d3.select(xScaleRef.current).call(d3.axisBottom(xScale))
    }, [xScaleRef.current, xScale])
    return {
        ref: xScaleRef,
        scale: xScale,
    }
}

export function useLinearScale(d?: [min: number, max: number], range?: [min: number, max: number]) {
    const [xScale, setXScale] = useState<any>()
    useEffect(() => {
        if (!d || !range) return
        const xs = d3.scaleLinear().domain([0, 100])
            .range([10, 290])
        setXScale(xs)
    }, [d, range])
    return xScale
}