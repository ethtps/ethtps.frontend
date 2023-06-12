/* tslint:disable */
/* eslint-disable */
/**
 * ETHTPS.info API
 * Backend definition for ethtps.info; you\'re free to play around
 *
 * The version of the OpenAPI document: v3
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    NumberedDataset,
    NumberedDatasetFromJSON,
    NumberedDatasetToJSON
} from '.'
import type { DataType, SimpleMultiDatasetAnalysis } from '../../../../api-client'
import {
    DataTypeFromJSON,
    DataTypeToJSON,
    SimpleMultiDatasetAnalysisFromJSON,
    SimpleMultiDatasetAnalysisToJSON,
    exists
} from '../../../../api-client'
/**
 *
 * @export
 * @interface L2DataResponseModel
 */
export interface NumberedL2DataResponseModel {
    /**
     *
     * @type {Dataset}
     * @memberof L2DataResponseModel
     */
    data?: NumberedDataset
    /**
     *
     * @type {Array<NumberedDataset>}
     * @memberof L2DataResponseModel
     */
    datasets?: Array<NumberedDataset> | null
    /**
     *
     * @type {SimpleMultiDatasetAnalysis}
     * @memberof L2DataResponseModel
     */
    simpleAnalysis?: SimpleMultiDatasetAnalysis
    /**
     *
     * @type {DataType}
     * @memberof L2DataResponseModel
     */
    dataType?: DataType
}

/**
 * Check if a given object implements the L2DataResponseModel interface.
 */
export function instanceOfL2DataResponseModel(value: object): boolean {
    let isInstance = true

    return isInstance
}

export function NumberedL2DataResponseModelFromJSON(json: any): NumberedL2DataResponseModel {
    return NumberedL2DataResponseModelFromJSONTyped(json, false)
}

export function NumberedL2DataResponseModelFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean
): NumberedL2DataResponseModel {
    if (json === undefined || json === null) {
        return json
    }
    return {
        data: !exists(json, 'data') ? undefined : NumberedDatasetFromJSON(json['data']),
        datasets: !exists(json, 'datasets')
            ? undefined
            : json['datasets'] === null
                ? null
                : (json['datasets'] as Array<any>).map(NumberedDatasetFromJSON),
        simpleAnalysis: !exists(json, 'simpleAnalysis')
            ? undefined
            : SimpleMultiDatasetAnalysisFromJSON(json['simpleAnalysis']),
        dataType: !exists(json, 'dataType')
            ? undefined
            : DataTypeFromJSON(json['dataType'])
    }
}

export function NumberedL2DataResponseModelToJSON(
    value?: NumberedL2DataResponseModel | null
): any {
    if (value === undefined) {
        return undefined
    }
    if (value === null) {
        return null
    }
    return {
        data: NumberedDatasetToJSON(value.data),
        datasets:
            value.datasets === undefined
                ? undefined
                : value.datasets === null
                    ? null
                    : (value.datasets as Array<any>).map(NumberedDatasetToJSON),
        simpleAnalysis: SimpleMultiDatasetAnalysisToJSON(value.simpleAnalysis),
        dataType: DataTypeToJSON(value.dataType)
    }
}
