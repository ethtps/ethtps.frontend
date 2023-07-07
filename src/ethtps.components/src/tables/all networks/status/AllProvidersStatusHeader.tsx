import { TableHeader } from '../../../..'
import {
	m_toShortString,
	useGetLiveDataModeFromAppStore,
} from '../../../../../ethtps.data/src'

export default function AllProvidersStatusHeader(): JSX.Element {
	const mode = useGetLiveDataModeFromAppStore()
	const modeStr = m_toShortString(mode)
	return (
		<>
			<TableHeader
				items={[
					{
						text: '#',
					},
					{
						text: 'Name',
					},
					{
						text: 'Status',
					},
				]}
			/>
		</>
	)
}
