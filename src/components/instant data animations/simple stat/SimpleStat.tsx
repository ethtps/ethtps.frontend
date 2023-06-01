import { Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Tooltip } from "@chakra-ui/react"
import { LiveDataDelta } from "."
import { binaryConditionalRender, conditionalRender, useColors } from "@/services"
import { BeatLoader } from "react-spinners"
import { AnimatedTypography, tableCellTypographyStandard } from "@/components"
import { numberFormat } from "@/data"

export function SimpleStat(props:
    {
        data: LiveDataDelta,
        loading?: boolean,
        isEstimated?: boolean,
        alt?: string
    }) {
    const colors = useColors()
    let deltaType: 'increase' | 'decrease' | undefined = undefined
    if (props.data.delta.type !== 'none') {
        if (props.data.delta.type === 'increase') {
            deltaType = 'increase'
        } else if (props.data.delta.type === 'decrease') {
            deltaType = 'decrease'
        }
    }
    return <>
        <Tooltip hasArrow label={props.alt ?? ''}>
            <Stat>
                <StatLabel color={colors.primaryContrast}>{props.data.type.toUpperCase()}</StatLabel>
                <StatNumber color={colors.primaryContrast}>
                    {binaryConditionalRender(<AnimatedTypography
                        animationClassName='animated-cell'
                        child={`${props.isEstimated ? "~" : ""}${numberFormat(props.data.value)}`}
                        durationMs={800}
                    />,
                        <>
                            <BeatLoader size={8} color={colors.primaryContrast} />
                        </>, !props.loading)}
                </StatNumber>
                {conditionalRender(<StatHelpText>
                    <StatArrow type={deltaType} />
                    <AnimatedTypography
                        sx={{
                            textColor: colors.primaryContrast
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