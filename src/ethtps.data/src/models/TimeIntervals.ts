import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import { unitOfTime } from 'moment'

export function m_toShortString(mode: ETHTPSDataCoreDataType) {
	switch (mode) {
		case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
			return 'GTPS'
		case ETHTPSDataCoreDataType.GPS:
			return ETHTPSDataCoreDataType.GPS
	}
	return ETHTPSDataCoreDataType.TPS
}

export function toShortString(interval: ETHTPSDataCoreTimeInterval) {
	switch (interval) {
		case 'All':
			return 'All'
		case 'Instant':
			return 'Instant'
		case 'OneDay':
			return '1d'
		case 'OneHour':
			return '1h'
		case 'OneMinute':
			return '1m'
		case 'OneMonth':
			return '1mo'
		case 'OneYear':
			return '1y'
		default:
			return 'Other'
	}
}

export type CrosshairLabelOptions = {
	demultiplier: number
	unit: string
}

const kd = -1000

export function toCrosshairLabel(interval: ExtendedTimeInterval): CrosshairLabelOptions {
	switch (interval) {
		case 'Instant':
			return { demultiplier: kd, unit: 'second' }
		case 'OneDay':
			return { demultiplier: kd * 60, unit: 'hours ago' }
		case ExtraIntervals.FifteenMinutes:
			return { demultiplier: kd * 60, unit: 'minutes ago' }
		case 'OneHour':
			return { demultiplier: kd * 60, unit: 'minutes ago' }
		case 'OneMinute':
			return { demultiplier: kd, unit: 'seconds ago' }
		case 'OneWeek':
			return { demultiplier: kd * 60 * 24, unit: 'days ago' }
		case 'OneMonth':
			return { demultiplier: kd * 60 * 24, unit: 'days ago' }
		case 'OneYear':
			return { demultiplier: kd * 60 * 24, unit: 'days ago' }
		default:
			return { demultiplier: kd * 60 * 24 * 365 * 10, unit: 'years ago' }
	}
}

export function toMoment(interval: ExtendedTimeInterval): {
	amount: number
	unit: unitOfTime.DurationConstructor
} {
	switch (interval) {
		case 'Instant':
			return { amount: 0, unit: 'second' }
		case 'OneDay':
			return { amount: 1, unit: 'day' }
		case ExtraIntervals.FifteenMinutes:
			return { amount: 15, unit: 'minute' }
		case 'OneHour':
			return { amount: 1, unit: 'hour' }
		case 'OneMinute':
			return { amount: 1, unit: 'minute' }
		case 'OneWeek':
			return { amount: 7, unit: 'day' }
		case 'OneMonth':
			return { amount: 1, unit: 'month' }
		case 'OneYear':
			return { amount: 1, unit: 'year' }
		default:
			return { amount: 10, unit: 'year' }
	}
}

export function dataTypeToString(type: ETHTPSDataCoreDataType) {
	switch (type) {
		case ETHTPSDataCoreDataType.TPS:
			return ETHTPSDataCoreDataType.TPS
		case ETHTPSDataCoreDataType.GPS:
			return ETHTPSDataCoreDataType.GPS
		default:
			return 'GTPS'
	}
}

export function dataTypeToHumanReadableString(type: ETHTPSDataCoreDataType) {
	switch (type) {
		case ETHTPSDataCoreDataType.TPS:
			return 'Transactions per second'
		case ETHTPSDataCoreDataType.GPS:
			return 'Gas per second'
		default:
			return 'Gas-adjusted transactions per second'
	}
}

// long string > short string
// example: OneMinute > 1m
export function toShortString_2(intervalName: string) {
	switch (intervalName) {
		case 'OneDay':
			return '1d'
		case 'OneHour':
			return '1h'
		case 'OneMinute':
			return '1m'
		case 'OneMonth':
			return '1mo'
		case 'OneYear':
			return '1y'
		case 'OneWeek':
			return '1w'
		default:
			return intervalName
	}
}

export function fromShortString_2(intervalName: string) {
	switch (intervalName) {
		case '1d':
			return 'OneDay'
		case '1h':
			return 'OneHour'
		case '1m':
			return 'OneMinute'
		case '1mo':
			return 'OneMonth'
		case '1y':
			return 'OneYear'
		case '1w':
			return 'OneWeek'
		default:
			return intervalName
	}
}

export enum ExtraIntervals {
	FifteenMinutes,
}
export type ExtendedTimeInterval = ETHTPSDataCoreTimeInterval | ExtraIntervals

export const TimeIntervalToSeconds = (interval: ExtendedTimeInterval) => {
	switch (interval) {
		case 'OneMinute':
			return 60
		case ExtraIntervals.FifteenMinutes:
			return 60 * 15
		case 'OneHour':
			return 60 * 60
		case 'OneDay':
			return 60 * 60 * 24
		case 'OneWeek':
			return 60 * 60 * 24 * 7
		case 'OneMonth':
			return 60 * 60 * 24 * 30
		case 'OneYear':
			return 60 * 60 * 24 * 365
		default:
			return 60
	}
}

export const TimeIntervalToStreamProps = (interval?: ExtendedTimeInterval) => {
	if (!interval)
		return {
			interval: '15m',
			limit: 60,
			duration: 60 * 15 * 1000,
			refreshInterval: 3 * 1000,
		}
	switch (interval) {
		case 'OneMinute':
			return {
				interval: '1m',
				limit: 60,
				duration: 60 * 1000,
				refreshInterval: 1 * 1000,
			}
		case 'OneHour':
			return {
				interval: '1h',
				limit: 60,
				duration: 60 * 60 * 1000,
				refreshInterval: 15 * 1000,
			}
		case 'OneDay':
			return {
				interval: '1d',
				limit: 24,
				duration: 60 * 24 * 1000,
				refreshInterval: 60 * 1000,
			}
		case 'OneWeek':
			return {
				interval: '1w',
				limit: 24 * 7,
				duration: 60 * 24 * 7 * 1000,
				refreshInterval: 60 * 60 * 1000,
			}
		case 'OneMonth':
			return {
				interval: '1mo',
				limit: 31,
				duration: 60 * 24 * 30 * 1000,
				refreshInterval: 60 * 60 * 1000,
			}
		case 'OneYear':
			return {
				interval: '1y',
				limit: 365,
				duration: 60 * 24 * 365 * 1000,
				refreshInterval: 60 * 60 * 1000,
			}
		default:
			return {
				interval: '15m',
				limit: 60,
				duration: 60 * 15 * 1000,
				refreshInterval: 3 * 1000,
			}
	}
}

export const TimeIntervalFromLabel = (label: string) => {
	switch (label) {
		case '1m':
			return 'OneMinute'
		case '15m':
			return ExtraIntervals.FifteenMinutes
		case '1h':
			return 'OneHour'
		case '1d':
			return 'OneDay'
		case '1w':
			return 'OneWeek'
		case '1mo':
			return 'OneMonth'
		case '1y':
			return 'OneYear'
		default:
			return 'OneMinute'
	}
}

export const TimeIntervalToLabel_2 = (interval: string) => {
	switch (interval) {
		case '1m':
			return 'One minute'
		case '15m':
			return 'Fifteen minutes'
		case '1h':
			return 'One hour'
		case '1d':
			return 'One day'
		case '1w':
			return 'One week'
		case '1mo':
			return 'One month'
		case '1y':
			return 'One year'
		default:
			return 'One minute'
	}
}

export const TimeIntervalToLabel = (interval: ExtendedTimeInterval) => {
	switch (interval) {
		case 'OneMinute':
			return '1m'
		case ExtraIntervals.FifteenMinutes:
			return '15m'
		case 'OneHour':
			return '1h'
		case 'OneDay':
			return '1d'
		case 'OneWeek':
			return '1w'
		case 'OneMonth':
			return '1mo'
		case 'OneYear':
			return '1y'
		default:
			return '1m'
	}
}

export const EnumerateIntervals = () => {
	return [
		'OneMinute',
		ExtraIntervals.FifteenMinutes,
		'OneHour',
		'OneDay',
		'OneWeek',
		'OneMonth',
		'OneYear',
	]
}
