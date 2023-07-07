import { TransactionMetadata } from '.'

export class MinimalDataPoint {
	constructor(
		public tps?: number,
		public gps?: number,
		public transactions?: TransactionMetadata[]
	) {}
}
