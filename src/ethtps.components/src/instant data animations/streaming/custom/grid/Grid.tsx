import Konva from "konva"
import { useCallback, useEffect, useRef, useState } from "react"
import { Group, Layer, Line } from "react-konva"
import { InstantDataAnimationProps, Theme, range, useColors } from "../../../../.."

interface IGridProps extends InstantDataAnimationProps {
    minXLines: number
    minYLines: number
    speed?: number // pixels per second
}

function createGrid(xLines: number, yLines: number, xDivisionSize: number, yDivisionSize: number, colors: Theme, props: Partial<IGridProps>) {
    return <Group width={props.width} height={props.height} visible>
        {range(xLines).map((i) => {// vertical lines
            return <Line
                key={`${i}x`}
                x={0}
                y={0}
                points={[i * xDivisionSize, 0, i * xDivisionSize, props.height ?? 0]}
                stroke={colors.grid}
                strokeEnabled
                strokeWidth={1} />
        }
        )}
        {range(yLines).map((i) => {// horizontal lines
            return <Line
                key={`${i}y`}
                x={0}
                y={0}
                points={[0, i * yDivisionSize, props.width ?? 0, i * yDivisionSize]}
                stroke={colors.grid}
                strokeEnabled
                strokeWidth={1} />
        }
        )}
    </Group>
}

export function Grid(props: Partial<IGridProps>) {
    const colors = useColors()
    const xLines = props.minXLines ?? 10
    const yLines = props.minYLines ?? 10
    const [xDivisionSize, setXDivisionSize] = useState((props.width ?? 0) / xLines)
    const [yDivisionSize, setYDivisionSize] = useState((props.height ?? 0) / yLines)
    useEffect(() => {
        setXDivisionSize((props.width ?? 0) / xLines)
        setYDivisionSize((props.height ?? 0) / yLines)
    }, [props.width, props.height, xLines, yLines])
    const gridLayerRef0 = useRef<Konva.Layer>(new Konva.Layer())
    const gridLayerRef1 = useRef<Konva.Layer>(new Konva.Layer())
    const animation = new Konva.Animation((frame) => {
        if (frame?.timeDiff && props.speed && props.height) {
            const delta = (frame?.timeDiff / 1000) * props.speed
            gridLayerRef0?.current?.move({ x: 0, y: -delta })
            if (gridLayerRef0?.current?.y() <= -props.height) {
                gridLayerRef0?.current?.move({ x: 0, y: 2 * props.height })
            }
            gridLayerRef1?.current?.move({ x: 0, y: -delta })
            if (gridLayerRef1?.current?.y() <= -props.height) {
                gridLayerRef1?.current?.move({ x: 0, y: 2 * props.height })
            }
        }
    }, [gridLayerRef0.current])
    useEffect(() => {
        if (!props.paused) {
            animation.start()
        }
        else {
            animation.stop()
        }
        return () => {
            animation.stop()
        }
    }, [props.paused])
    useEffect(() => {
        if (!props.paused) {
            animation.start()
        }
    }, [])
    animation.start()
    const getFirstGrid = useCallback(() => {
        return createGrid(xLines, yLines, xDivisionSize, yDivisionSize, colors, props)
    }, [xLines, yLines, xDivisionSize, yDivisionSize, colors, props])

    const getSecondGrid = useCallback(() => {
        return createGrid(xLines, yLines, xDivisionSize, yDivisionSize, colors, props)
    }, [xLines, yLines, xDivisionSize, yDivisionSize, colors, props])


    return <>
        <Layer ref={gridLayerRef0}>
            {getFirstGrid()}
        </Layer>
        <Layer
            y={props.height ?? 0}
            ref={gridLayerRef1}>
            {getSecondGrid()}
        </Layer>
    </>
}