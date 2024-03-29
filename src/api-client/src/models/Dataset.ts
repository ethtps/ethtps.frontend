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

import { exists, mapValues } from '../runtime'
import type { ComplexDatasetAnalysis } from './ComplexDatasetAnalysis'
import {
  ComplexDatasetAnalysisFromJSON,
  ComplexDatasetAnalysisFromJSONTyped,
  ComplexDatasetAnalysisToJSON
} from './ComplexDatasetAnalysis'
import type { IXYMultiConvertible } from './IXYMultiConvertible'
import {
  IXYMultiConvertibleFromJSON,
  IXYMultiConvertibleFromJSONTyped,
  IXYMultiConvertibleToJSON
} from './IXYMultiConvertible'
import type { SimpleDatasetAnalysis } from './SimpleDatasetAnalysis'
import {
  SimpleDatasetAnalysisFromJSON,
  SimpleDatasetAnalysisFromJSONTyped,
  SimpleDatasetAnalysisToJSON
} from './SimpleDatasetAnalysis'

/**
 *
 * @export
 * @interface Dataset
 */
export interface Dataset {
  /**
   *
   * @type {Array<IXYMultiConvertible>}
   * @memberof Dataset
   */
  dataPoints?: Array<IXYMultiConvertible> | null
  /**
   *
   * @type {string}
   * @memberof Dataset
   */
  provider?: string | null
  /**
   *
   * @type {SimpleDatasetAnalysis}
   * @memberof Dataset
   */
  simpleAnalysis?: SimpleDatasetAnalysis
  /**
   *
   * @type {ComplexDatasetAnalysis}
   * @memberof Dataset
   */
  complexAnalysis?: ComplexDatasetAnalysis
}

/**
 * Check if a given object implements the Dataset interface.
 */
export function instanceOfDataset(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function DatasetFromJSON(json: any): Dataset {
  return DatasetFromJSONTyped(json, false)
}

export function DatasetFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Dataset {
  if (json === undefined || json === null) {
    return json
  }
  return {
    dataPoints: !exists(json, 'dataPoints')
      ? undefined
      : json['dataPoints'] === null
      ? null
      : (json['dataPoints'] as Array<any>).map(IXYMultiConvertibleFromJSON),
    provider: !exists(json, 'provider') ? undefined : json['provider'],
    simpleAnalysis: !exists(json, 'simpleAnalysis')
      ? undefined
      : SimpleDatasetAnalysisFromJSON(json['simpleAnalysis']),
    complexAnalysis: !exists(json, 'complexAnalysis')
      ? undefined
      : ComplexDatasetAnalysisFromJSON(json['complexAnalysis'])
  }
}

export function DatasetToJSON(value?: Dataset | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    dataPoints:
      value.dataPoints === undefined
        ? undefined
        : value.dataPoints === null
        ? null
        : (value.dataPoints as Array<any>).map(IXYMultiConvertibleToJSON),
    provider: value.provider,
    simpleAnalysis: SimpleDatasetAnalysisToJSON(value.simpleAnalysis),
    complexAnalysis: ComplexDatasetAnalysisToJSON(value.complexAnalysis)
  }
}
