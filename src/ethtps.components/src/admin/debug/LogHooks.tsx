import { Box, Code, Divider, Grid, Stack, Text, Textarea } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { binaryConditionalRender, conditionalRender, useColors } from '../../..'
import { DebugBehaviors, LogDetails, getColorForLevel } from '../../../../ethtps.data/src'

function createCard(e: Partial<LogDetails> | undefined, i: number, textColor: string = 'black') {
    if (!e) return <></>
    const color = getColorForLevel(e.level)
    return <Grid key={`logeffect-${i}${e.name}`}>
        {conditionalRender(<>
            <Code colorScheme={color}>{`${e.name}:`}</Code>
            <Code>{''}</Code>
        </>, !!e.name)}
        {conditionalRender(
            binaryConditionalRender(<>
                <Code>{e.details}</Code>
            </>, <Textarea disabled value={e.details} color={textColor} />,
                !!e.details && e.details.length < 100 && e.details.length > 0) ?? <></>,
            !!e.name || !!e.details)}

        <Divider h={'3px'} opacity={0.2} />
    </Grid>
}

export function useLogCards() {
    const [cards, setCards] = useState<JSX.Element>()
    const colors = useColors()
    useEffect(() => {
        DebugBehaviors.logBehavior.subscribe(() => {
            const list = DebugBehaviors.logBehavior.getAll()
            setCards(<Stack>
                <Text fontFamily={'monospace'} fontSize={'md'} fontWeight={'bold'}>Logs</Text>
                <Box overflowY={'scroll'}>
                    {Object.keys(list).map((effectKey, i) => {
                        const e = list[effectKey]
                        return createCard(e, i, colors.text)
                    })}
                </Box>
            </Stack>)
        }, 'logCards@debugOverlay')
    }, [setCards, DebugBehaviors.logBehavior])
    return cards
}