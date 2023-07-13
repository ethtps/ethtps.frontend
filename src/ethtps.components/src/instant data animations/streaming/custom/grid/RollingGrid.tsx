import Konva from "konva"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Group, Layer, Line } from "react-konva"
import { IInstantDataAnimationProps, Theme, range, useColors } from "../../../../.."

interface IGridProps extends IInstantDataAnimationProps {
    minXLines: number
    minYLines: number
    speed?: number // pixels per second
    withLabels?: boolean
    children?: JSX.Element
}

function createGrid(xLines: number, yLines: number, xDivisionSize: number, yDivisionSize: number, colors: Theme, width?: number, height?: number) {
    return <Group width={width} height={height} visible>
        {range(xLines).map((i) => {// vertical lines
            return <Line
                key={`${i}x`}
                x={0}
                y={0}
                points={[i * xDivisionSize, 0, i * xDivisionSize, height ?? 0]}
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
                points={[0, i * yDivisionSize, width ?? 0, i * yDivisionSize]}
                stroke={colors.grid}
                strokeEnabled
                strokeWidth={1} />
        }
        )}
    </Group>
}

export function RollingGrid(props: Partial<IGridProps>) {
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
    const chartLayerRef = useRef<Konva.Layer>(new Konva.Layer())
    const animationConstructor = useCallback(() => {
        //console.info('animation instantiation callback')
        return new Konva.Animation((frame) => {
            if (frame?.timeDiff && props.speed && props.height && !props.paused) {
                const delta = (frame?.timeDiff / 1000) * props.speed
                chartLayerRef?.current?.move({ x: 0, y: -delta })
                gridLayerRef0?.current?.move({ x: 0, y: -delta })
                if (gridLayerRef0?.current?.y() <= -props.height) {
                    gridLayerRef0?.current?.move({ x: 0, y: 2 * props.height })
                }
                gridLayerRef1?.current?.move({ x: 0, y: -delta })
                if (gridLayerRef1?.current?.y() <= -props.height) {
                    gridLayerRef1?.current?.move({ x: 0, y: 2 * props.height })
                }
            }
        }, [gridLayerRef0.current, gridLayerRef1.current, chartLayerRef.current])
    }, [props.height, props.speed, props.paused])
    const [animation, setAnimation] = useState<Konva.Animation | undefined>()
    useEffect(() => {
        setAnimation(animationConstructor())
    }, [animationConstructor])
    useEffect(() => {
        if (!props.paused) {
            animation?.start()
        }
        else {
            animation?.stop()
        }
        return () => {
            animation?.stop()
        }
    }, [props.paused, animation])
    useEffect(() => {
        if (!props.paused) {
            animation?.start()
        }
    }, [animation])
    animation?.start()
    const getFirstGrid = useMemo(() => {
        //console.info('getFirstGrid callback')
        return createGrid(xLines, yLines, xDivisionSize, yDivisionSize, colors, props.width, props.height)
    }, [xLines, yLines, xDivisionSize, yDivisionSize, colors, props.connected])

    const getSecondGrid = useMemo(() => {
        //console.info('getSecondGrid callback')
        return createGrid(xLines, yLines, xDivisionSize, yDivisionSize, colors, props.width, props.height)
    }, [xLines, yLines, xDivisionSize, yDivisionSize, colors, props.connected])


    return <>
        <Layer ref={gridLayerRef0}>
            {getFirstGrid}
        </Layer>
        <Layer
            y={props.height ?? 0}
            ref={gridLayerRef1}>
            {getSecondGrid}
        </Layer>
        <Layer ref={chartLayerRef}>
            {props.children}
        </Layer>
    </>
}