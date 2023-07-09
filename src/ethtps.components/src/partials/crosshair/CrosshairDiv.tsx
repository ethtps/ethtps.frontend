import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import { getRelativeMousePosition } from '../../..'
import NonSSRWrapper from '../../NonSSRWrapper'

export function CrosshairDiv(props:
    {
        children: JSX.Element
        width: number,
        height: number
    }) {
    const toast = useToast()
    const [mousePos, setMousePos] = useState<{ x: number, y: number } | undefined>()
    return ( // we're drawing this client-side
        <>
            <NonSSRWrapper>
                <div
                    style={{
                        width: props.width,
                        height: props.height,
                        position: 'absolute',
                    }}
                    onMouseLeave={() => setMousePos(undefined)}
                    onMouseMove={(e) => setMousePos(getRelativeMousePosition(e))}>
                    <Stage width={props.width} height={props.height}>
                        <Layer>
                            {mousePos && <>
                                <Line
                                    x={0}
                                    y={0}
                                    points={[0, mousePos.y,
                                        props.width, mousePos.y]}
                                    stroke="black" />
                                <Line
                                    x={0}
                                    y={0}
                                    points={[mousePos.x, 0,
                                    mousePos.x, props.height]}
                                    stroke="black" />
                            </>}
                        </Layer>
                    </Stage>
                </div>
            </NonSSRWrapper>
            {props.children}
        </>
    )
}