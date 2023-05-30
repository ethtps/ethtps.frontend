import { Stat, StatArrow, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react"
import { LiveDataDelta } from "."

export function SimpleStat(props: { data: LiveDataDelta }) {
    let deltaType: 'increase' | 'decrease' | undefined = undefined
    if (props.data.delta.type !== 'none') {
        if (props.data.delta.type === 'increase') {
            deltaType = 'increase'
        } else if (props.data.delta.type === 'decrease') {
            deltaType = 'decrease'
        }
    }
    return <>
        <Stat>
            <StatLabel>{props.data.type.toUpperCase()}</StatLabel>
            <StatNumber>{props.data.value}</StatNumber>
            <StatHelpText>
                <StatArrow type={deltaType} />
                {props.data.delta.value}
            </StatHelpText>
        </Stat>
    </>
}