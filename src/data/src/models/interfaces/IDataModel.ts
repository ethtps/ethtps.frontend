import { DataPointDictionary } from '../../common-types'

export interface IDataModel {
	tpsData?: DataPointDictionary
	gpsData?: DataPointDictionary
	gtpsData?: DataPointDictionary
}
