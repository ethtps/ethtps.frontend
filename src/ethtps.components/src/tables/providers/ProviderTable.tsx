import { Image, Stack, Table, Text, Tooltip } from '@chakra-ui/react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'
import { useState } from 'react'
import { darkenColorIfNecessary } from '../../..'

type ExtraColumns = Partial<{
	currentValue: number
	maxRecorded: number
}>

type ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel =
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel & ExtraColumns

type SortState = {
	column:
	| keyof ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel
	| null
	ascending: boolean
}

const arrowUp = <span>&#9660;</span>
const arrowDown = <span>&#9650;</span>

const getArrowForColumn = (
	column: keyof ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	sortState: SortState
) => {
	if (sortState.column === column) {
		return sortState.ascending ? arrowUp : arrowDown
	} else {
		return null
	}
}

interface IProviderTableProps {
	providers: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
}

export function ProviderTable(props: IProviderTableProps): JSX.Element {
	const [data, setData] = useState<
		ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
	>(props.providers)
	const [sortState, setSortState] = useState<SortState>({
		column: null,
		ascending: false,
	})

	const handleSort = (
		columnName: keyof ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel
	) => {
		setData(
			data.slice().sort((a, b) => {
				const valueA = a[columnName]
				const valueB = b[columnName]
				if (valueA === valueB) {
					return 0
				}
				if (valueA == null) {
					return 1
				}
				if (valueB == null) {
					return -1
				}
				if (sortState.ascending) {
					return valueA < valueB ? -1 : 1
				} else {
					return valueA < valueB ? 1 : -1
				}
			})
		)
		setSortState({
			column: columnName,
			ascending: !sortState.ascending,
		})
	}

	const arrowForColumn = (
		column: keyof ExtendedETHTPSDataCoreModelsResponseModelsProviderResponseModel
	) => getArrowForColumn(column, sortState)

	return (
		<Table className="my-table" cellSpacing="sm">
			<thead>
				<tr>
					<th>#</th>
					<th onClick={() => handleSort('name')} className="sortable">
						Name {arrowForColumn('name')}
					</th>
					<th
						onClick={() => handleSort('currentValue')}
						className="sortable">
						Current {arrowForColumn('currentValue')}
					</th>
					<th
						onClick={() => handleSort('maxRecorded')}
						className="sortable">
						Max recorded {arrowForColumn('maxRecorded')}
					</th>
					<th onClick={() => handleSort('type')} className="sortable">
						Type {arrowForColumn('type')}
					</th>
					<th
						onClick={() => handleSort('isGeneralPurpose')}
						className="sortable">
						General Purpose {arrowForColumn('isGeneralPurpose')}
					</th>
				</tr>
			</thead>
			<tbody>
				{data.map((provider, i) => (
					<tr
						key={provider.name}
						className={i % 2 === 0 ? 'even-row' : 'odd-row'}
						style={{
							color: darkenColorIfNecessary(
								provider.color ?? 'black'
							),
						}}>
						<td>{i + 1}</td>
						<td
							className="name-cell"
							style={{ fontWeight: 'bold' }}>
							<Link href={`/providers/${provider.name}`}>
								<Stack spacing={'xs'}>
									<Image
										src={`/provider-icons-sm/${provider.name}.png`}
										alt={
											provider.name ??
											'provider name here'
										}
										width={24}
										height={24}
									/>
									<span className="name-text">
										<Tooltip
											title={`Click to read more about ${provider.name}`}
											sx={{ fontWeight: 'normal' }}>
											<Text>{provider.name}</Text>
										</Tooltip>
									</span>
								</Stack>
							</Link>
						</td>
						<td>{provider.currentValue ?? 0}</td>
						<td>{provider.maxRecorded ?? 0}</td>
						<td>{provider.type}</td>
						<td>{provider.isGeneralPurpose ? 'Yes' : 'No'}</td>
					</tr>
				))}
			</tbody>
		</Table>
	)
}
