import { useToast } from '@chakra-ui/react'
import { KonvaEventObject } from 'konva/lib/Node'
import { useEffect, useState } from 'react'
import { Layer, Line, Stage, Text } from 'react-konva'
import { getRelativeMousePosition, useColors } from '../../..'
import { CrosshairLabelOptions, ExtendedTimeInterval, linearMap, toCrosshairLabel } from '../../../../ethtps.data/src'
import NonSSRWrapper from '../../NonSSRWrapper'

type ScaleSettings = {
    start: number
    end: number
    interval: ExtendedTimeInterval
}

type TimeScaleSettings = {

} & ScaleSettings

type ValueScaleSettings = {

} & ScaleSettings

export function CrosshairDiv(props:
    {
        children: JSX.Element
        width: number,
        height: number,
        verticalPadding: number
        ssr?: boolean
        timeScale?: TimeScaleSettings
        valueScale?: ValueScaleSettings
    }) {
    const toast = useToast()
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | undefined>()
    const colors = useColors()
    const [timeLabel, setTimeLabel] = useState<CrosshairLabelOptions>()
    useEffect(() => {
        if (props.timeScale) {
            setTimeLabel(toCrosshairLabel(props.timeScale.interval))
        }
    }, [props.timeScale?.interval])
    const [isDragging, setIsDragging] = useState(false)
    const [currentViewOffset, setCurrentViewOffset] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [adjustedMousePos, setAdjustedMousePos] = useState<{ x: number, y: number }>({
        x: 0,
        y: 0
    })
    useEffect(() => {
        if (mousePos) {
            setAdjustedMousePos({
                x: mousePos?.x - currentViewOffset.x,
                y: mousePos?.y - currentViewOffset.y
            })
        }
    }, [currentViewOffset])
    const dragStart = (e: KonvaEventObject<DragEvent>) => {
        setIsDragging(true)
    }
    const dragEnd = (e: KonvaEventObject<DragEvent>) => {
        setIsDragging(false)
    }
    const dragMove = (e: KonvaEventObject<DragEvent>) => {
        setCurrentViewOffset({ x: e.target.x(), y: e.target.y() })
    }
    return ( // we're drawing this client-side
        <>
            <NonSSRWrapper>
                <div
                    style={{
                        position: 'absolute',
                    }}
                    onMouseLeave={() => setMousePos(undefined)}
                    onMouseMove={(e) => setMousePos(getRelativeMousePosition(e))}>
                    <Stage
                        draggable
                        onDragStart={dragStart}
                        onDragEnd={dragEnd}
                        onDragMove={dragMove}
                        width={props.width}
                        height={props.height - props.verticalPadding}>
                        {!props.ssr && props.children}
                        <Layer>
                            {mousePos && <>
                                <Line
                                    x={-currentViewOffset.x}
                                    y={0}
                                    points={[0, mousePos.y - currentViewOffset.y,
                                        props.width, mousePos.y - currentViewOffset.y]}
                                    stroke={colors.crosshair}
                                    strokeWidth={1} />
                                <Line
                                    x={0}
                                    y={-currentViewOffset.y}
                                    points={[mousePos.x - currentViewOffset.x, 0,
                                    mousePos.x - currentViewOffset.x, props.height - props.verticalPadding]}
                                    stroke={colors.crosshair}
                                    strokeWidth={1} />
                                {props.timeScale && <Text
                                    x={12 - currentViewOffset.x}
                                    y={(mousePos.y - currentViewOffset.y - 24)}
                                    text={`${Math.round(linearMap(adjustedMousePos.y, 0, props.height, props.timeScale.end, props.timeScale.start) / (timeLabel?.demultiplier ?? 1))} ${timeLabel?.unit}`}
                                    fill={colors.crosshair}
                                    fontSize={12}
                                    fontFamily={'monospace'}
                                    fontStyle={'bold'}
                                    align={'center'}
                                    verticalAlign={'middle'}
                                    padding={2}
                                />}
                            </>}
                        </Layer>
                    </Stage>
                </div>
            </NonSSRWrapper>
            {!!props.ssr && props.children}
        </>
    )
}