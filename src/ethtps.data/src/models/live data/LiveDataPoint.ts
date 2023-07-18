import { MinimalDataPoint, TransactionMetadata } from '.'

export class LiveDataPoint implements MinimalDataPoint {
    /**
     * Unix timestamp in milliseconds
     */
    public x?: number
    public get y(): Partial<MinimalDataPoint> {
        return {
            tps: this.tps,
            gps: this.gps,
            gtps: this.gtps,
        }
    }
    /**
     * Usually the provider name
     */
    public z?: string
    public tps?: number
    public gps?: number
    public readonly gtps?: number = (this.gps ?? 0) / 21000
    public transactions?: TransactionMetadata[]
    public compare(other: LiveDataPoint): boolean {
        return this.tps === other.tps && this.gps === other.gps
    }
    public toString(): string {
        return `${this.z}@${this.x}`
    }
}