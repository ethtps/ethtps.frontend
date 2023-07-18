import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { L2DataUpdateModel, LiveDataPoint } from '.'
import { GenericDictionary } from '../../'
import { ILiveDataPointOperator } from './DataOperators'

/**
 * Aggregates live data from multiple providers
 */
export class LiveDataAggregator implements ILiveDataPointOperator {
	private data: GenericDictionary<L2DataUpdateModel> = {}
	private tpsSum: number = 0
	private gpsSum: number = 0
	private maxTps: number = 0
	private maxGps: number = 0
	private maxTotalTps: number = 0
	private maxTotalGps: number = 0
	constructor(initialData?: GenericDictionary<L2DataUpdateModel>) {
		if (initialData) this.data = initialData
	}

	public update(entry: L2DataUpdateModel) {
		if (entry.data?.tps) {
			this.tpsSum -= this.data[entry.provider]?.data?.tps || 0
			this.tpsSum += entry.data.tps
			this.maxTps = Math.max(this.maxTps, entry.data.tps)
		}
		if (entry.data?.gps) {
			this.gpsSum -= this.data[entry.provider]?.data?.gps || 0
			this.gpsSum += entry.data.gps
			this.maxGps = Math.max(this.maxGps, entry.data.gps)
		}
		this.data[entry.provider] = entry
	}

	public get(provider?: string | null) {
		if (!provider) return undefined
		return this.data[provider]
	}

	public get lastEntry() {
		return this.data
	}

	public updateMultiple(
		entries: GenericDictionary<L2DataUpdateModel>,
		excludeSidechains?: boolean,
		providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
	) {
		for (let key in entries) {
			if (excludeSidechains && providerData) {
				const provider = providerData.find((p) => p.name === key)
				if (provider && provider.type === 'Sidechain') continue
			}
			this.update(entries[key] as L2DataUpdateModel)
		}
		if (!this.sum.compare(this.maxTotal)) {
			this.maxTotalTps = Math.max(this.maxTotalTps, this.sum.tps ?? 0)
			this.maxTotalGps = Math.max(this.maxTotalGps, this.sum.gps ?? 0)
		}
	}

	public get sum(): LiveDataPoint {
		const sum = new LiveDataPoint()
		sum.gps = this.gpsSum
		sum.tps = this.tpsSum
		sum.x = Date.now()
		return sum
	}

	public get maxSingle(): LiveDataPoint {
		const max = new LiveDataPoint()
		max.gps = this.maxGps
		max.tps = this.maxTps
		max.x = Date.now()
		return max
	}

	public get maxTotal(): LiveDataPoint {
		const max = new LiveDataPoint()
		max.gps = this.maxTotalGps
		max.tps = this.maxTotalTps
		max.x = Date.now()
		return max
	}

	public get average() {
		const count = 1 //Object.keys(this.data).length
		return {
			tps: count > 0 ? this.tpsSum / count : 0,
			gps: count > 0 ? this.gpsSum / count : 0,
		} as LiveDataPoint
	}
}
