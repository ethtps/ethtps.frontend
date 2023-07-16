import { TransactionMetadata } from '.'

export interface MinimalDataPoint {
	tps?: number
	gps?: number
	transactions?: TransactionMetadata[]
	readonly gtps?: number
}

class CMinimalDataPoint {
	public readonly gtps?: number
	constructor(
		public tps?: number,
		public gps?: number,
		public transactions?: TransactionMetadata[]
	) {
		this.gtps = (this.gps ?? 0) / 21000
	}
}
