import { Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Tooltip } from "@chakra-ui/react"
import { LiveDataDelta } from "."
import { binaryConditionalRender, conditionalRender, useColors } from "@/services"
import { BeatLoader } from "react-spinners"
import { AnimatedTypography, MouseOverEvents, tableCellTypographyStandard } from "@/components"
import { numberFormat } from "@/data"

export function SimpleStat(props:
    {
        data: LiveDataDelta,
        loading?: boolean,
        isEstimated?: boolean,
        isSelected?: boolean,
        alt?: string
    } & MouseOverEvents) {
    const colors = useColors()
    let deltaType: 'increase' | 'decrease' | undefined = undefined
    if (props.data.delta.type !== 'none') {
        if (props.data.delta.type === 'increase') {
            deltaType = 'increase'
        } else if (props.data.delta.type === 'decrease') {
            deltaType = 'decrease'
        }
    }
    const color = (props.isSelected ?? false) ? colors.text : colors.text
    const opacity = (props.isSelected ?? false) ? 1 : 0.5
    return <>
        <Tooltip hasArrow label={props.alt ?? ''}>
            <Stat
                sx={{
                    cursor: 'pointer',
                }}
                onMouseOver={props.onMouseOver}
                onMouseLeave={props.onMouseLeave}
                onClick={props.onClick}>
                <StatLabel opacity={opacity} color={color}>{props.data.type.toUpperCase()}</StatLabel>
                <StatNumber opacity={opacity} color={color}>
                    {binaryConditionalRender(<AnimatedTypography
                        animationClassName='animated-cell'
                        child={`${props.isEstimated ? "~" : ""}${numberFormat(props.data.value)}`}
                        durationMs={800}
                    />,
                        <>
                            <BeatLoader size={8} color={color} />
                        </>, !props.loading)}
                </StatNumber>
                {conditionalRender(<StatHelpText>
                    <StatArrow type={deltaType} />
                    <AnimatedTypography
                        sx={{
                            textColor: color
                        }}
                        animationClassName='animated-cell inline'
                        child={numberFormat(props.data.delta.value)}
                        durationMs={800}
                    />
                </StatHelpText>, !props.loading)}
            </Stat>
        </Tooltip>
    </>
}