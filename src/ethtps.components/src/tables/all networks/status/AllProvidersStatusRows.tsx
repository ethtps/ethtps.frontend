/* eslint-disable import/no-internal-modules */

import { Tr } from '@chakra-ui/react'
import { range } from 'd3-array'
import { useEffect, useState } from 'react'
import {
	IProviderTableModel,
	getModeData,
	useGetLiveDataFromAppStore,
	useGetLiveDataModeFromAppStore,
} from '../../../../../ethtps.data/src'
import { IndexCell, NameCell, UpdaterStatusCell } from '../cells'

export default function AllProvidersStatusRows(
	model: Partial<IProviderTableModel>
): JSX.Element {
	const hasData = (model.providerData?.length as number) > 0
	const mode = useGetLiveDataModeFromAppStore()
	const liveData = useGetLiveDataFromAppStore()
	const [data, setData] = useState(getModeData(liveData ?? {}, mode))
	useEffect(() => {
		setData(getModeData(liveData ?? {}, mode))
	}, [mode, liveData])
	return (
		<>
			{hasData ? (
				<>
					{model.providerData
						?.slice(
							0,
							Math.min(
								model.providerData?.length,
								model.maxRowsBeforeShowingExpand as number
							)
						)
						?.map((x, i) => {
							//console.log("AllProvidersRows", x, i)
							return (
								<Tr key={i} placeContent={'center'}>
									<IndexCell
										clickCallback={model.clickCallback}
										index={i + 1}
									/>
									<NameCell
										clickCallback={model.clickCallback}
										provider={x}
									/>
									<UpdaterStatusCell
										status={x.status}
										provider={x}
									/>
								</Tr>
							)
						})}
				</>
			) : (
				renderNoDataRows()
			)}
		</>
	)
}
function renderNoDataRows(): JSX.Element {
	return (
		<>
			{range(3).map((y: number) => {
				return <tr key={y}></tr>
			})}
		</>
	)
}
