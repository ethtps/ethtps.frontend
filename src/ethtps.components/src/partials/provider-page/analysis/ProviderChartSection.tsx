import { Stack } from '@chakra-ui/react'
import { LineChart } from '..'
import { ETHTPSApi } from '../../../../../ethtps.data/src'

export interface IProviderChartSectionProps {
	provider?: string
	api: ETHTPSApi
}

export function ProviderChartSection(
	props: IProviderChartSectionProps
): JSX.Element {
	return (
		<>
			<Stack>
				<Stack>
					<LineChart
						api={props.api}
						title={'Historical data'}
						provider={props.provider}
						width={500}
						height={300}
					/>
				</Stack>
				<Stack>
					<LineChart
						api={props.api}
						title={'Gas per transaction'}
						provider={props.provider}
						width={500}
						height={300}
					/>
				</Stack>
			</Stack>
		</>
	)
}
