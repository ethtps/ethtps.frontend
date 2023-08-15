import { Box, Center, Code, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Thead, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { AnimatedTypography, conditionalRender } from '../../..'
import { DebugBehaviors, EffectDetails, GenericDictionary, getColorForRenderTime, groupBy } from '../../../../ethtps.data/src'

function createCard(e: Partial<EffectDetails> | undefined, i: number) {
    const avg = !!e ? (e.totalTimeMs! / e.totalCalls!) : NaN
    const color = getColorForRenderTime(avg)
    const k = `cardg${e?.name}_${e?.group}`
    return <Tr
        sx={{
            fontFamily: 'monospace',
            '*': {
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
            },
            'index-cell.*': {
                fontWeight: 'bold'
            }
        }}
        key={`${k}_row`}>
        <Td className={i === 0 ? 'index-cell' : undefined} key={`${k}_name`}>
            <Code colorScheme={'gray'}>{`${e?.group} ${e?.name}`}</Code>
        </Td>
        <Td key={`${k}_avg`}>
            <AnimatedTypography sx={{
                bg: color + ".100",
                color: 'black'
            }}
                child={`${avg.toFixed(2)}ms`} />
        </Td>
        <Td key={`${k}_calls`} isNumeric>
            <AnimatedTypography child={`${e?.totalCalls}`} />
        </Td>
    </Tr>
}

let effectCardsSet: boolean = false

function createCardGroups(e: GenericDictionary<Partial<EffectDetails>>) {
    const groups = groupBy(Object.keys(e).map((k => e[k])), x => x.group ?? 'UnknownGroup')
    const groupKeys = Object.keys(groups!)
    const keys = groupKeys.filter((x, i) => groupKeys.indexOf(x) === i)
    const total = keys.flatMap(k => groups?.[k].map(h => !!e ? (h.totalTimeMs! / h.totalCalls!) : 0)).reduce((v, a) => (a ?? 0) + (v ?? 0))
    return conditionalRender(<>
        <Box>
            <TableContainer>
                <Table size={'sm'} variant={'simple'}>
                    <TableCaption fontSize={16} placement={'top'}>Effects</TableCaption>
                    <Thead>
                        <Tr>
                            <Td>
                                <Text fontFamily={'monospace'} fontSize={'md'} fontWeight={'Bold'}>Measurement</Text>
                            </Td>
                            <Td>
                                <Text fontFamily={'monospace'} fontSize={'md'} fontWeight={'Bold'}>Average</Text>
                            </Td>
                            <Td>
                                <Text fontFamily={'monospace'} fontSize={'md'} fontWeight={'Bold'}>Calls</Text>
                            </Td>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <>
                            {keys.map((g, i) => groups?.[g]?.map(createCard))}
                        </>
                        <Tr>
                            <Td></Td>
                            <Td>
                                <Center>
                                    <AnimatedTypography sx={{
                                        bg: getColorForRenderTime(total) + ".100",
                                        color: 'black',
                                        fontFamily: 'monospace'
                                    }}
                                        child={`${((total ?? 0)).toFixed(2)}ms`} />
                                </Center>
                            </Td>
                            <Td></Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    </>, !!groups)
}

const getEffects = () => DebugBehaviors.effectBehavior.getAll()

export function useEffectBehaviorCards() {
    const [cards, setCards] = useState<JSX.Element>()
    useEffect(() => {
        DebugBehaviors.effectBehavior.subscribe(() => {
            const list = getEffects()
            setCards(<Stack>
                {createCardGroups(list)}
            </Stack>)
        }, 'effectCards@debugOverlay')
    }, [])
    return cards
}