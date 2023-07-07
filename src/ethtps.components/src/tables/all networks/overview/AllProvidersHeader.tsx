import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
} from 'ethtps.api'
import {
	dataTypeToString,
	m_toShortString,
	useGetLiveDataModeFromAppStore,
} from '../../../../../ethtps.data/src'
import { TableHeader } from '../../TableHeader'

export function AllProvidersHeader(props: {
	dataType: ETHTPSDataCoreDataType
	columnClicked?: (
		column: keyof ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	) => void
}): JSX.Element {
	const mode = useGetLiveDataModeFromAppStore()
	const modeStr = m_toShortString(mode)
	return (
		<>
			<TableHeader
				columnClicked={props.columnClicked}
				items={[
					{ text: '#' },
					{ text: 'Name' },
					{ text: 'Type' },
					{ text: dataTypeToString(props.dataType) },
					{
						text: `Max recorded ${dataTypeToString(
							props.dataType
						)}`,
					},
				]}
			/>
		</>
	)
}
