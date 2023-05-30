import { IBasicLiveUpdaterStatus } from "@/api-client"
import { Alert, AlertIcon, HStack, Td, Text, Tooltip } from "@chakra-ui/react"
import { ICustomCellConfiguration } from "."
import { binaryConditionalRender, conditionalRender, useColors } from "@/services"
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"

interface IUpdaterStatusCellProps extends ICustomCellConfiguration {
    status?: IBasicLiveUpdaterStatus
}

export function UpdaterStatusCell(props: IUpdaterStatusCellProps) {
    const colors = useColors()
    const [tooltipMessage, setTooltipMessage] = useState<string | undefined>(undefined)
    useEffect(() => {

        if (props.status?.isUnreliable) {
            setTooltipMessage(`Live data is currently not available for ${props.provider?.name}`)
        }
        else if (props.status?.isProbablyDown) {
            setTooltipMessage(`There are issues getting data for ${props.provider?.name}`)
        }
    }, [props.status, props.provider?.name])
    return <>
        <Td>
            <Tooltip
                bgColor={colors.gray1}
                placement={'top'}
                label={<Text color={colors.text}>
                    {tooltipMessage}
                </Text>}>
                <HStack alignContent={'center'}>
                    {binaryConditionalRender(<>
                        <>
                            <IconCheck aria-label="ok" />
                            <Text color={colors.text}>Ok</Text>
                        </>
                    </>,
                        binaryConditionalRender(<>
                            <IconX aria-label="not ok" />
                            <Text color={colors.text}>Not available</Text>
                        </>, <>
                            <IconExclamationMark aria-label="errors" />
                            <Text color={colors.text}>Unreliable</Text>
                        </>, props.status?.isUnreliable)
                        , !props.status?.isProbablyDown)}
                </HStack>
            </Tooltip>
        </Td >
    </>
}