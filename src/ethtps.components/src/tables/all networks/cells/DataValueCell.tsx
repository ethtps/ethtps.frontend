import { Td } from '@chakra-ui/react'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { AnimatedTypography } from '../../../..'
import {
	LiveDataAggregator,
	numberFormat,
} from '../../../../../ethtps.data/src'
import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'

interface IDataValueCellConfiguration extends ICustomCellConfiguration {
	dataType: ETHTPSDataCoreDataType
	aggregator?: LiveDataAggregator
	initialValue?: number
}

export function DataValueCell(
	config: IDataValueCellConfiguration
): JSX.Element {
	const value = config.aggregator?.get(config.provider?.name)
	let v: number | undefined
	switch (config.dataType) {
		case ETHTPSDataCoreDataType.TPS:
			v = value?.data?.tps
			break
		case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
			if (value?.data?.gps) v = value?.data?.gps / 21000
			break
		case ETHTPSDataCoreDataType.GPS:
			v = value?.data?.gps
			break
	}

	return (
		<>
			<Td
				onClick={() =>
					config.clickCallback !== undefined
						? config.clickCallback(config.provider, 'DataValue')
						: () => {}
				}>
				<AnimatedTypography
					animationClassName="animated-cell"
					sx={tableCellTypographyStandard}
					child={numberFormat(v ?? config.initialValue).toString()}
					durationMs={1000}
				/>
			</Td>
		</>
	)
}
