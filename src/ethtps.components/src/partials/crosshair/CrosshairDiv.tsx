import { useToast } from '@chakra-ui/react'
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
                        style={{
                        }}
                        width={props.width}
                        height={props.height - props.verticalPadding}>
                        <Layer>
                            {mousePos && <>
                                <Line
                                    x={0}
                                    y={0}
                                    points={[0, mousePos.y,
                                        props.width, mousePos.y]}
                                    stroke={colors.crosshair}
                                    strokeWidth={1} />
                                <Line
                                    x={0}
                                    y={0}
                                    points={[mousePos.x, 0,
                                    mousePos.x, props.height - props.verticalPadding]}
                                    stroke={colors.crosshair}
                                    strokeWidth={1} />
                                {props.timeScale && <Text
                                    x={12}
                                    y={Math.abs(mousePos.y - 24)}
                                    text={`${Math.round(linearMap(mousePos.y, 0, props.height, props.timeScale.end, props.timeScale.start) / (timeLabel?.demultiplier ?? 1))} ${timeLabel?.unit}`}
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
                        {!props.ssr && props.children}
                    </Stage>
                </div>
            </NonSSRWrapper>
            {!!props.ssr && props.children}
        </>
    )
}