import { Td, Text, Tooltip } from '@chakra-ui/react'
import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsDataPointsDataPoint,
} from 'ethtps.api'
import moment from 'moment'
import { useColors } from '../../../..'
import {
	getMaxDataFor,
	IDataModel,
	numberFormat,
} from '../../../../../ethtps.data/src'
import {
	buildClassNames,
	ICustomCellConfiguration,
} from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'

function generateMaxHoverMessage(
	data?: ETHTPSDataCoreModelsDataPointsDataPoint
): string {
	if (
		data === undefined ||
		(data?.blockNumber === undefined && data?.date === undefined) ||
		data?.blockNumber === 0 ||
		moment(data?.date).year() === undefined ||
		moment(data?.date).year() === 1
	) {
		return ''
	}

	if (data?.blockNumber !== undefined && data?.blockNumber !== 0) {
		return `Seen at block ${numberFormat(
			data?.blockNumber ?? 0
		).toString()}`
	}

	return `Seen ${moment(data?.date)}`
}

function generateMaxTypography(data?: ETHTPSDataCoreModelsDataPointsDataPoint) {
	const message = generateMaxHoverMessage(data)
	return message?.length > 0 ? message : undefined
}

interface IMaxValueCellProps extends ICustomCellConfiguration {
	maxData: IDataModel
	dataType: ETHTPSDataCoreDataType
}
export function MaxValueCell(config: Partial<IMaxValueCellProps>): JSX.Element {
	const max = getMaxDataFor(
		config.maxData,
		config.provider?.name,
		config.dataType
	)
	const tooltipTypography = generateMaxTypography(max)
	const colors = useColors()
	return (
		<>
			<Td
				{...buildClassNames(config)}
				textColor={colors.text}
				textAlign={'center'}
				onClick={() =>
					config.clickCallback !== undefined
						? config.clickCallback(config.provider, 'MaxValue')
						: () => {}
				}>
				<Tooltip hasArrow title={tooltipTypography}>
					<Text
						className={'boldcell'}
						{...tableCellTypographyStandard}
						sx={{
							textDecoration:
								tooltipTypography !== undefined
									? 'underline'
									: undefined,
						}}>
						{numberFormat(max?.value).toString()}
					</Text>
				</Tooltip>
			</Td>
		</>
	)
}
