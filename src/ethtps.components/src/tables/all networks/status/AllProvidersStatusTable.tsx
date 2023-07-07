import {
	Alert,
	AlertIcon,
	Link,
	Table,
	Tbody,
	Text,
	Thead,
	Tr,
} from '@chakra-ui/react'
import { useState } from 'react'
import { conditionalRender, useColors } from '../../../..'
import { IProviderTableModel } from '../../../../../ethtps.data/src'
import AllProvidersStatusHeader from './AllProvidersStatusHeader'
import AllProvidersStatusRows from './AllProvidersStatusRows'

export default function AllProvidersStatusTable({
	providerData,
	maxRowsBeforeShowingExpand = 25,
}: Partial<IProviderTableModel>): JSX.Element {
	const oldShowRowCountValue = maxRowsBeforeShowingExpand as number
	const [showRowCount, setShowRowCount] = useState(maxRowsBeforeShowingExpand)
	const onSeeMore = () => {
		setShowRowCount(providerData?.length as number)
	}
	const onSeeLess = () => {
		setShowRowCount(oldShowRowCountValue)
	}
	const colors = useColors()
	return (
		<>
			<Table
				aria-label="collapsible table"
				w={'100%'}
				minW={'600px'}
				overflow={'scroll'}
				variant={'unstyled'}>
				<Thead>
					<Tr placeContent={'center'}>
						<AllProvidersStatusHeader />
					</Tr>
				</Thead>
				<Tbody>
					<AllProvidersStatusRows
						providerData={providerData}
						maxRowsBeforeShowingExpand={maxRowsBeforeShowingExpand}
					/>
				</Tbody>
			</Table>
			{conditionalRender(
				<Alert status="error">
					<AlertIcon />
					Error loading data. Try{' '}
					<Link href="/">
						<Text
							className={'spaced-horizontally'}
							color={colors.text}>
							refreshing
						</Text>
					</Link>{' '}
					the page.
				</Alert>,
				(providerData?.length ?? 0) === 0
			)}
		</>
	)
}
