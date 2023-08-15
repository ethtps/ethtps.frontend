import { Card, CardBody, CardHeader, Center, Divider, Heading, Stack, useBoolean } from "@chakra-ui/react"
import { IconBug } from "@tabler/icons-react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import { conditionalRender } from "../../.."
import { useAppSelector } from "../../../../ethtps.data/src"
import { useEffectBehaviorCards } from "./EffectHooks"
import { useLogCards } from "./LogHooks"
import { useSize } from '@chakra-ui/react-use-size'

interface IDebugOverlayProps {
    show?: boolean
}

export function DebugOverlay({ show }: IDebugOverlayProps): JSX.Element {
    const onStop = (data: DraggableData, e?: DraggableEvent | undefined) => {

        localStorage.setItem('debugOverlayPosition', JSON.stringify({
            x: data.x,
            y: data.y
        }))
    }
    const initialOrPreviousPosition = JSON.parse(localStorage.getItem('debugOverlayPosition') ?? '{"x":0,"y":0}') as { x: number, y: number }
    const debugData = useAppSelector(s => s.debugging)
    const cards = useEffectBehaviorCards()
    const logCards = useLogCards()
    const [collapsed, c] = useBoolean(false)
    const iconSize = collapsed ? 60 : 90
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const cardRef = useRef<any>(null)
    const cardSize = useSize(cardRef)
    useEffect(() => {
        if (collapsed) {

        }
        else {

        }
    }, [collapsed])
    return <>
        {conditionalRender(<Draggable
            /*
            bounds={{
                top: 0,
                left: 0,
                right: window.innerWidth - (cardSize?.width ?? 0) - iconSize,
                bottom: window.innerHeight - (cardSize?.height ?? 0) - iconSize
            }}*/
            allowAnyClick
            onDrag={() => setIsDragging(true)}
            onStop={(e, d) => {
                setTimeout(() => setIsDragging(false), 0)
                onStop(d, e)
            }}
            defaultPosition={initialOrPreviousPosition}>
            <Card
                ref={cardRef}
                style={{
                }}
                maxW={collapsed ? cardSize : 450}
                bg={collapsed ? 'transparent' : undefined}
                onClick={() => {
                    // Only fire if it was not a drag event
                    if (!isDragging) {
                        c.toggle()

                    }
                }}>
                <CardHeader>
                    <Center>
                        <Heading>
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 1.0 }}>
                                <IconBug width={iconSize} height={iconSize} />
                            </motion.div>
                        </Heading>
                    </Center>
                </CardHeader>
                <CardBody
                    sx={{
                        overflow: 'hidden'
                    }}>
                    <motion.div
                        animate={{
                            height: collapsed ? 0 : 'auto',
                        }}
                        transition={{ duration: 0.3 }}>
                        <Stack spacing={4}>
                            {cards}
                            <Divider />
                            {logCards}
                        </Stack>
                    </motion.div>
                </CardBody>
            </Card>
        </Draggable>, (!!show) && debugData.enabled)}
    </>
}