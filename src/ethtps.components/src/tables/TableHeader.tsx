import { Th } from '@chakra-ui/react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import React from 'react'
import { useColors } from '..'

export function toETHTPSDataCoreModelsResponseModelsProviderResponseModelKey(
	key: string
): keyof ETHTPSDataCoreModelsResponseModelsProviderResponseModel {
	const model: ETHTPSDataCoreModelsResponseModelsProviderResponseModel = {
		name: null,
		color: null,
		theoreticalMaxTPS: undefined,
		type: null,
		isGeneralPurpose: undefined,
		isSubchainOf: null,
		status: undefined,
	}

	if (key in model) {
		return key as keyof ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	} else {
		return 'status'
	}
}

export interface ITableHeader {
	text: string
	subItems?: ITableHeader[]
	columnClicked?: (
		column: keyof ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	) => void
}

// Component for rendering a single table header
const SingleTableHeader: React.FC<ITableHeader> = ({
	text,
	subItems,
	columnClicked,
}): JSX.Element => {
	const colors = useColors()

	return (
		<Th
			color={colors.text}
			bgColor={colors.gray1}
			_hover={{
				color: colors.primary,
				bgColor: colors.gray2,
				cursor: 's-resize',
			}}
			onClick={() =>
				columnClicked?.(
					toETHTPSDataCoreModelsResponseModelsProviderResponseModelKey(
						text
					)
				)
			}
			fontSize={'1rem'}
			height={50}>
			{text}
			{/*subItems && subItems.map((subItem, index) => (
        <SingleTableHeader key={`${subItem.text}${index}`} {...subItem} />
      ))*/}
		</Th>
	)
}

// Component for rendering multiple table headers
export function TableHeader({
	items,
	columnClicked,
}: {
	items: ITableHeader[]
	columnClicked?: (
		column: keyof ETHTPSDataCoreModelsResponseModelsProviderResponseModel
	) => void
}) {
	return (
		<>
			{items.map((item, index) => (
				<SingleTableHeader
					columnClicked={columnClicked}
					key={`${item.text}${index}`}
					{...item}
				/>
			))}
		</>
	)
}
