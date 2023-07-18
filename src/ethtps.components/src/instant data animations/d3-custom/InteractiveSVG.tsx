import * as d3 from "d3"
import { useEffect, useRef, useState } from "react"
import { Padded, WithMargins } from "../../.."
import { addDrag } from "./Hooks"

interface IInteractiveSVGNodeEvents {
    onDrag: (dx: number, dy: number) => void
}

interface NonSVGProps {
    minX: number
    minY: number
    children: React.ReactNode
}

interface IInteractiveSVGNodeProps extends IInteractiveSVGNodeEvents, Padded, WithMargins, NonSVGProps {
    width: number
    height: number
}

/**
 *  A <g/> element that can be dragged around.
 *
 */
export function InteractiveSVG(props: Partial<IInteractiveSVGNodeProps>) {
    const svgRef = useRef<any>(null)
    const [dx, setDx] = useState(0)
    const [dragging, setDragging] = useState(false)
    useEffect(() => {
        if (!svgRef.current) return
        addDrag(d3.select(svgRef.current), (event) => {
            //main.attr('viewBox', `${-event.x} ${0} ${innerWidth} ${innerHeight}`)
            setDx(x => x - event.dx)
            props?.onDrag?.(event.dx, event.dy)
        })
        console.log('added drag')
    }, [svgRef.current, props?.onDrag])
    return <>
        <svg ref={svgRef}
            width={props?.width ?? 0}
            height={props?.height ?? 0}
            transform={`translate(${(props?.minX ?? 0) + dx}px, 0px)`}
            viewBox={`${(props?.minX ?? 0) + dx} ${(props?.minY ?? 0)} ${(props?.width ?? 0) + dx} ${props?.height ?? 0}`}>
            {props?.children}
        </svg>
    </>
}