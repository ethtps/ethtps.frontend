import { useEffect, useState } from 'react'

import * as d3 from 'd3'
import { Extent, Padded, SelectedSVG, ViewBoxDimensions, WithMargins } from '../../..'
import { ETHTPSDataCoreTimeInterval } from 'ethtps.api'

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

export function addGrid(svgNode: SelectedSVG, x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>, height: number, width: number, k: number, padding?: Partial<Padded>, margins?: Partial<WithMargins>) {
    //svgNode.enter().selectAll().remove()
    const dx = (margins?.marginLeft ?? 0) + (padding?.paddingLeft ?? 0)
    const dy = (margins?.marginTop ?? 0) + (padding?.paddingTop ?? 0)
    svgNode
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call(g => g
            .selectAll(".x")
            .data(x.ticks(12))
            .join( // Vertical lines
                enter => enter.append("line").attr("class", "x").attr("y2", height)
                    .attr('y1', 0),
                update => update,
                exit => exit.remove()
            )
            .attr("x1", d => x(d))
            .attr("x2", d => x(d)))
        .call(g => g
            .selectAll(".y")
            .data(y.ticks(k))
            .join( // Horizontal lines
                enter => enter.append("line").attr("class", "y").attr("x2", width),
                update => update,
                exit => exit.remove()
            )
            .attr("y1", d => y(d))
            .attr("y2", d => y(d)))
}