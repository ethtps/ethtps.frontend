import { DataPointDictionary } from '../../common-types'
import { DataType, DataPoint } from '../../../../api-client'

export interface IMaxDataModel {
	maxTPSData?: DataPointDictionary
	maxGPSData?: DataPointDictionary
	maxGTPSData?: DataPointDictionary
}
