import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { HeatmapTab } from '..'

export enum Breakdowns {
	transactionType = 'txtype',
	period = 'period',
}

interface IBreakdownTabProps {
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	selectedSection: string
}

export function BreakdownTab({
	provider,
	selectedSection = 'txtype',
}: Partial<IBreakdownTabProps>): JSX.Element {
	return (
		<>
			<HeatmapTab {...{ provider }} />
		</>
	)
}
