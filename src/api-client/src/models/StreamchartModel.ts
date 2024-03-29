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
import type { LegendModel } from './LegendModel'
import {
  LegendModelFromJSON,
  LegendModelFromJSONTyped,
  LegendModelToJSON
} from './LegendModel'

/**
 *
 * @export
 * @interface StreamchartModel
 */
export interface StreamchartModel {
  /**
   *
   * @type {LegendModel}
   * @memberof StreamchartModel
   */
  legend?: LegendModel
  /**
   *
   * @type {Array<Array<number>>}
   * @memberof StreamchartModel
   */
  tpsData?: Array<Array<number>> | null
  /**
   *
   * @type {number}
   * @memberof StreamchartModel
   */
  maxTPS?: number
  /**
   *
   * @type {Array<Array<number>>}
   * @memberof StreamchartModel
   */
  gpsData?: Array<Array<number>> | null
  /**
   *
   * @type {number}
   * @memberof StreamchartModel
   */
  maxGPS?: number
  /**
   *
   * @type {Array<Array<number>>}
   * @memberof StreamchartModel
   */
  gtpsData?: Array<Array<number>> | null
  /**
   *
   * @type {number}
   * @memberof StreamchartModel
   */
  maxGTPS?: number
}

/**
 * Check if a given object implements the StreamchartModel interface.
 */
export function instanceOfStreamchartModel(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function StreamchartModelFromJSON(json: any): StreamchartModel {
  return StreamchartModelFromJSONTyped(json, false)
}

export function StreamchartModelFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): StreamchartModel {
  if (json === undefined || json === null) {
    return json
  }
  return {
    legend: !exists(json, 'legend')
      ? undefined
      : LegendModelFromJSON(json['legend']),
    tpsData: !exists(json, 'tpsData') ? undefined : json['tpsData'],
    maxTPS: !exists(json, 'maxTPS') ? undefined : json['maxTPS'],
    gpsData: !exists(json, 'gpsData') ? undefined : json['gpsData'],
    maxGPS: !exists(json, 'maxGPS') ? undefined : json['maxGPS'],
    gtpsData: !exists(json, 'gtpsData') ? undefined : json['gtpsData'],
    maxGTPS: !exists(json, 'maxGTPS') ? undefined : json['maxGTPS']
  }
}

export function StreamchartModelToJSON(value?: StreamchartModel | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    legend: LegendModelToJSON(value.legend),
    tpsData: value.tpsData,
    maxTPS: value.maxTPS,
    gpsData: value.gpsData,
    maxGPS: value.maxGPS,
    gtpsData: value.gtpsData,
    maxGTPS: value.maxGTPS
  }
}
