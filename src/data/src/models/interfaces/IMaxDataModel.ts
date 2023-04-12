
import { DataPoint } from '../../../../api-client/src/models/DataPoint'
import { DataType } from '../../../../api-client/src/models/DataType'
import { DataPointDictionary } from '../../common-types/Dictionaries'

export interface IMaxDataModel {
	maxTPSData?: DataPointDictionary
	maxGPSData?: DataPointDictionary
	maxGTPSData?: DataPointDictionary
	getMaxDataFor(provider: string, type: DataType): DataPoint | undefined
}
