import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import { getRelativeMousePosition, useColors } from '../../..'
import NonSSRWrapper from '../../NonSSRWrapper'


export function CrosshairDiv(props:
    {
        children: JSX.Element
        width: number,
        height: number,
        verticalPadding: number
        ssr?: boolean
    }) {
    const toast = useToast()
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | undefined>()
    const colors = useColors()
    return ( // we're drawing this client-side
        <> <NonSSRWrapper>
            <div
                style={{
                    position: 'absolute',
                }}
                onMouseLeave={() => setMousePos(undefined)}
                onMouseMove={(e) => setMousePos(getRelativeMousePosition(e))}>
                <Stage width={props.width} height={props.height - props.verticalPadding}>
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