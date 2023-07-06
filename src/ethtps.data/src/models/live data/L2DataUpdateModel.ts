import { MinimalDataPoint, TransactionMetadata } from '.'


export class L2DataUpdateModel {
    constructor(public provider: string,
        public data?: MinimalDataPoint,
        public blockNumber?: number,
        public transactions?: TransactionMetadata[]) { }
}