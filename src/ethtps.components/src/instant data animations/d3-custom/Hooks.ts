import { useEffect, useState } from 'react'

import * as d3 from 'd3'
import { Extent, SelectedSVG, ViewBoxDimensions } from '../../..'

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

export function addZoom(svg: SelectedSVG,
    viewBox: ViewBoxDimensions,
    scaleExtent: Extent,
    onZoom?: (transform: d3.ZoomTransform) => void) {
    function zoomed(p: { transform: any }) {
        svg.attr("transform", p.transform)
        onZoom?.(p.transform)
    }
    svg.call(d3.zoom()
        .extent(viewBox)
        .scaleExtent(scaleExtent)
        .on("zoom", zoomed))
}

export function addDrag(svg: SelectedSVG,
    onDrag?: () => void,
    onDragStarted?: (() => void),
    onDragEnded?: (() => void)) {
    function dragged(this: Element, event: any, d: unknown) {
        d3.select(this).attr("cx", event.x).attr("cy", event.y)
        onDrag?.()
    }
    function dragStarted() {
        svg.attr("cursor", "grabbing")
        onDragStarted?.()
    }
    function dragEnded() {
        svg.attr("cursor", "grab")
        onDragEnded?.()
    }
    svg.call(d3.drag()
        .on("drag", dragged)
        .on("start", dragStarted)
        .on("end", dragEnded))
}
