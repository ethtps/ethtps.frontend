// eslint-disable-next-line import/no-internal-modules

import { Center, Modal, Select, Stack, Text } from '@chakra-ui/react'
import { useDisclosure } from '@mantine/hooks'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useCallback, useState } from 'react'
import { ChartActions, SocialButtons } from '../../../../../..'

interface IHeatmapTabProps {
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
}

enum Breakdowns {
	tps = 'transactions per second',
	gps = 'gas per second',
	gtps = 'gas-adjusted transactions per second',
}

enum BreakdownPeriods {
	year = 'year',
	month = 'month',
	day = 'day',
	hourOfDay = 'hour of day',
	dayOfWeek = 'day of week',
}

const plusYearsShown = 1
const minusYearsShown = 1

export function HeatmapTab(props: Partial<IHeatmapTabProps>): JSX.Element {
	const [modelOpened, { open, close }] = useDisclosure(false)
	const [year, setYear] = useState<number>(new Date().getFullYear())
	const [breakdown, setBreakdown] = useState<Breakdowns>(Breakdowns.tps)
	const [breakdownPeriod, setBreakdownPeriod] = useState<BreakdownPeriods>(
		BreakdownPeriods.year
	)

	const getHeatmap = useCallback(() => {
		return (
			<>
				<Stack
					sx={{
						padding: '1rem',
					}}>
					<Center>
						<Stack
							sx={{
								marginLeft: '2rem',
							}}>
							<Text
								className={'inline'}
								sx={{
									marginRight: '0.1rem',
									marginLeft: '0.1rem',
								}}>
								Average {props.provider?.name}
							</Text>
							<Select
								onChange={(e) =>
									setBreakdown(e as unknown as Breakdowns)
								}
								className={'inline'}
								defaultValue={Breakdowns.tps}>
								{Object.values(Breakdowns)}
							</Select>
							<Text
								className={'inline'}
								sx={{
									marginRight: '0.1rem',
									marginLeft: '0.1rem',
								}}>
								grouped by
							</Text>
							<Select
								className={'inline'}
								width={'auto'}
								onChange={(e) =>
									setBreakdownPeriod(
										e as unknown as BreakdownPeriods
									)
								}
								defaultValue={BreakdownPeriods.year}>
								{Object.values(BreakdownPeriods)}
							</Select>
						</Stack>
					</Center>
				</Stack>
			</>
		)
	}, [props.provider])

	return (
		<>
			<Modal
				isOpen={modelOpened}
				size="calc(100vw - 1rem)"
				onClose={close}>
				<Stack>
					<SocialButtons />
				</Stack>
				<Center>{getHeatmap()}</Center>
			</Modal>

			<div>
				<ChartActions
					showDownload
					showMaximize
					onMaximize={() => open()}
				/>
			</div>
			{getHeatmap()}
		</>
	)
}
