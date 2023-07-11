import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsDataPointsDataPoint,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
} from 'ethtps.api'
import { IDataModel } from '..'

export const groupBy = <T>(
	array: T[] | undefined,
	predicate: (value: T, index: number, array: T[]) => string
) =>
	array?.reduce(
		(acc, value, index, array) => {
			; (acc[predicate(value, index, array)] ||= []).push(value)
			return acc
		},
		{} as { [key: string]: T[] }
	)

export const generatePath = (
	provider?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
) => {
	return { params: { currentProvider: provider?.name ?? '' } }
}

export function getMaxDataFor(
	model?: IDataModel,
	provider?: string | null,
	type?: ETHTPSDataCoreDataType
): ETHTPSDataCoreModelsDataPointsDataPoint | undefined {
	if (!provider || !type || !model) return
	switch (type) {
		case ETHTPSDataCoreDataType.TPS:
			if (model.tpsData) return model.tpsData[provider]
		case ETHTPSDataCoreDataType.GPS:
			if (model.gpsData) return model.gpsData[provider]
		case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
			if (model.gtpsData) return model.gtpsData[provider]
	}
}

export function linearMap(
	value: number,
	in_min: number,
	in_max: number,
	out_min: number,
	out_max: number
) {
	return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
}