import { HStack, Td, Text, Tooltip } from '@chakra-ui/react'
import { IconCheck, IconExclamationMark, IconX } from '@tabler/icons-react'
import { ETHTPSDataCoreModelsDataUpdaterLiveDataUpdaterStatus } from 'ethtps.api'
import { useEffect, useState } from 'react'
import { ICustomCellConfiguration } from '.'
import { binaryConditionalRender, useColors } from '../../../..'

interface IUpdaterStatusCellProps extends ICustomCellConfiguration {
	status?: ETHTPSDataCoreModelsDataUpdaterLiveDataUpdaterStatus
}

export function UpdaterStatusCell(props: IUpdaterStatusCellProps): JSX.Element {
	const colors = useColors()
	const [tooltipMessage, setTooltipMessage] = useState<string | React.ReactNode | undefined>(
		undefined
	)
	useEffect(() => {
		if (props.status?.isUnreliable) {
			setTooltipMessage(
				<>
					Live data is currently not available for {props.provider?.name}
				</>
			)
		} else if (props.status?.isProbablyDown) {
			setTooltipMessage(
				`There are issues getting data for ${props.provider?.name}`
			)
		}
	}, [props.status, props.provider?.name])
	return (
		<>
			<Td>
				<Tooltip
					shouldWrapChildren
					placement={'top'}
					label={tooltipMessage}>
					<HStack alignContent={'center'}>
						{binaryConditionalRender(
							<>
								<>
									<IconCheck aria-label="ok" />
									<Text className={'unselectable'} color={colors.text}>Ok</Text>
								</>
							</>,
							binaryConditionalRender(
								<>
									<IconX aria-label="not ok" />
									<Text color={colors.text}>
										Not available
									</Text>
								</>,
								<>
									<IconExclamationMark aria-label="errors" />
									<Text color={colors.text}>Unreliable</Text>
								</>,
								props.status?.isUnreliable
							),
							!props.status?.isProbablyDown
						)}
					</HStack>
				</Tooltip>
			</Td>
		</>
	)
}
