import { unitOfTime } from 'moment'
import { DataType, TimeInterval } from '../../../api-client'

export function m_toShortString(mode: DataType) {
	switch (mode) {
		case DataType.GasAdjustedTps:
			return 'GTPS'
		case DataType.Gps:
			return 'GPS'
	}
	return 'TPS'
}

export function toShortString(interval: TimeInterval) {
	switch (interval) {
		case TimeInterval.All:
			return 'All'
		case TimeInterval.Instant:
			return 'Instant'
		case TimeInterval.OneDay:
			return '1d'
		case TimeInterval.OneHour:
			return '1h'
		case TimeInterval.OneMinute:
			return '1m'
		case TimeInterval.OneMonth:
			return '1mo'
		case TimeInterval.OneYear:
			return '1y'
		default:
			return 'Other'
	}
}

export function toMoment(interval: ExtendedTimeInterval): { amount: number, unit: unitOfTime.DurationConstructor } {
	switch (interval) {
		case TimeInterval.Instant:
			return { amount: 0, unit: 'second' }
		case TimeInterval.OneDay:
			return { amount: 1, unit: 'day' }
		case ExtraIntervals.FifteenMinutes:
			return { amount: 15, unit: 'minute' }
		case TimeInterval.OneHour:
			return { amount: 1, unit: 'hour' }
		case TimeInterval.OneMinute:
			return { amount: 1, unit: 'minute' }
		case TimeInterval.OneWeek:
			return { amount: 7, unit: 'day' }
		case TimeInterval.OneMonth:
			return { amount: 1, unit: 'month' }
		case TimeInterval.OneYear:
			return { amount: 1, unit: 'year' }
		default:
			return { amount: 10, unit: 'year' }
	}
}

export function dataTypeToString(type: DataType) {
	switch (type) {
		case DataType.Tps:
			return 'TPS'
		case DataType.Gps:
			return 'GPS'
		default:
			return 'GTPS'
	}
}

export function dataTypeToHumanReadableString(type: DataType) {
	switch (type) {
		case DataType.Tps:
			return 'Transactions per second'
		case DataType.Gps:
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

export enum ExtraIntervals { FifteenMinutes }
export type ExtendedTimeInterval = TimeInterval | ExtraIntervals

export const TimeIntervalToSeconds = (interval: ExtendedTimeInterval) => {
	switch (interval) {
		case TimeInterval.OneMinute:
			return 60
		case ExtraIntervals.FifteenMinutes:
			return 60 * 15
		case TimeInterval.OneHour:
			return 60 * 60
		case TimeInterval.OneDay:
			return 60 * 60 * 24
		case TimeInterval.OneWeek:
			return 60 * 60 * 24 * 7
		case TimeInterval.OneMonth:
			return 60 * 60 * 24 * 30
		case TimeInterval.OneYear:
			return 60 * 60 * 24 * 365
		default:
			return 60
	}
}

export const TimeIntervalToStreamProps = (interval?: ExtendedTimeInterval) => {
	if (!interval) return { interval: '15m', limit: 60, duration: 60 * 15 * 1000, refreshInterval: 3 * 1000 }
	switch (interval) {
		case TimeInterval.OneMinute:
			return { interval: '1m', limit: 60, duration: 60 * 1000, refreshInterval: 1 * 1000 }
		case TimeInterval.OneHour:
			return { interval: '1h', limit: 60, duration: 60 * 60 * 1000, refreshInterval: 15 * 1000 }
		case TimeInterval.OneDay:
			return { interval: '1d', limit: 24, duration: 60 * 24 * 1000, refreshInterval: 60 * 1000 }
		case TimeInterval.OneWeek:
			return { interval: '1w', limit: 24 * 7, duration: 60 * 24 * 7 * 1000, refreshInterval: 60 * 60 * 1000 }
		case TimeInterval.OneMonth:
			return { interval: '1mo', limit: 31, duration: 60 * 24 * 30 * 1000, refreshInterval: 60 * 60 * 1000 }
		case TimeInterval.OneYear:
			return { interval: '1y', limit: 365, duration: 60 * 24 * 365 * 1000, refreshInterval: 60 * 60 * 1000 }
		default:
			return { interval: '15m', limit: 60, duration: 60 * 15 * 1000, refreshInterval: 3 * 1000 }
	}
}

export const TimeIntervalFromLabel = (label: string) => {
	switch (label) {
		case "1m":
			return TimeInterval.OneMinute
		case "15m":
			return ExtraIntervals.FifteenMinutes
		case "1h":
			return TimeInterval.OneHour
		case "1d":
			return TimeInterval.OneDay
		case "1w":
			return TimeInterval.OneWeek
		case "1mo":
			return TimeInterval.OneMonth
		case "1y":
			return TimeInterval.OneYear
		default:
			return TimeInterval.OneMinute
	}
}

export const TimeIntervalToLabel_2 = (interval: string) => {
	switch (interval) {
		case "1m":
			return "One minute"
		case "15m":
			return "Fifteen minutes"
		case "1h":
			return "One hour"
		case "1d":
			return "One day"
		case "1w":
			return "One week"
		case "1mo":
			return "One month"
		case "1y":
			return "One year"
		default:
			return "One minute"
	}
}

export const TimeIntervalToLabel = (interval: ExtendedTimeInterval) => {
	switch (interval) {
		case TimeInterval.OneMinute:
			return "1m"
		case ExtraIntervals.FifteenMinutes:
			return '15m'
		case TimeInterval.OneHour:
			return "1h"
		case TimeInterval.OneDay:
			return "1d"
		case TimeInterval.OneWeek:
			return "1w"
		case TimeInterval.OneMonth:
			return "1mo"
		case TimeInterval.OneYear:
			return "1y"
		default:
			return "1m"
	}
}

export const EnumerateIntervals = () => {
	return [
		TimeInterval.OneMinute,
		ExtraIntervals.FifteenMinutes,
		TimeInterval.OneHour,
		TimeInterval.OneDay,
		TimeInterval.OneWeek,
		TimeInterval.OneMonth,
		TimeInterval.OneYear,
	]
}
