import { L2DataUpdateModel } from '.'

/**
 * Aggregates live data from multiple providers
 */
export class LiveDataAggregator {
    private providers: { [key: string]: L2DataUpdateModel[] } = {};
    private tpsSum: number = 0;
    private gpsSum: number = 0;
    private count: number = 0;

    public update(entry: L2DataUpdateModel) {
        if (!this.providers[entry.provider]) {
            this.providers[entry.provider] = []
        }
        this.providers[entry.provider].push(entry)
        if (entry.data?.tps) {
            this.tpsSum += entry.data.tps
        }
        if (entry.data?.gps) {
            this.gpsSum += entry.data.gps
        }
        this.count++
    }

    public updateMultiple(entries: L2DataUpdateModel[]) {
        for (let entry of entries) {
            this.update(entry)
        }
    }

    public get average() {
        return {
            tps: this.count > 0 ? this.tpsSum / this.count : 0,
            gps: this.count > 0 ? this.gpsSum / this.count : 0
        }
    }
}
