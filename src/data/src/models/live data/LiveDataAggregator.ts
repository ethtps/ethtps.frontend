import { Dictionary } from '@reduxjs/toolkit'
import { L2DataUpdateModel } from '.'

/**
 * Aggregates live data from multiple providers
 */
export class LiveDataAggregator {
    private data: Dictionary<L2DataUpdateModel> = {}
    private tpsSum: number = 0
    private gpsSum: number = 0

    public update(entry: L2DataUpdateModel) {
        if (entry.data?.tps) {
            this.tpsSum -= this.data[entry.provider]?.data?.tps || 0
            this.tpsSum += entry.data.tps
        }
        if (entry.data?.gps) {
            this.gpsSum -= this.data[entry.provider]?.data?.gps || 0
            this.gpsSum += entry.data.gps
        }
        this.data[entry.provider] = entry
    }

    public get(provider?: string | null) {
        if (!provider) return undefined
        return this.data[provider]
    }

    public updateMultiple(entries: Dictionary<L2DataUpdateModel>) {
        for (let key in entries) {
            this.update(entries[key] as L2DataUpdateModel)
        }
    }

    public get average() {
        const count = Object.keys(this.data).length
        return {
            tps: count > 0 ? this.tpsSum / count : 0,
            gps: count > 0 ? this.gpsSum / count : 0
        }
    }
}
