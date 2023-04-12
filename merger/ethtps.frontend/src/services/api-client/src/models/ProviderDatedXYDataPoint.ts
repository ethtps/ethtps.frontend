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
/**
 *
 * @export
 * @interface ProviderDatedXYDataPoint
 */
export interface ProviderDatedXYDataPoint {
  /**
   *
   * @type {string}
   * @memberof ProviderDatedXYDataPoint
   */
  provider?: string | null
  /**
   *
   * @type {Date}
   * @memberof ProviderDatedXYDataPoint
   */
  x?: Date
  /**
   *
   * @type {number}
   * @memberof ProviderDatedXYDataPoint
   */
  y?: number
}

/**
 * Check if a given object implements the ProviderDatedXYDataPoint interface.
 */
export function instanceOfProviderDatedXYDataPoint(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ProviderDatedXYDataPointFromJSON(
  json: any
): ProviderDatedXYDataPoint {
  return ProviderDatedXYDataPointFromJSONTyped(json, false)
}

export function ProviderDatedXYDataPointFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ProviderDatedXYDataPoint {
  if (json === undefined || json === null) {
    return json
  }
  return {
    provider: !exists(json, 'provider') ? undefined : json['provider'],
    x: !exists(json, 'x') ? undefined : new Date(json['x']),
    y: !exists(json, 'y') ? undefined : json['y']
  }
}

export function ProviderDatedXYDataPointToJSON(
  value?: ProviderDatedXYDataPoint | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    provider: value.provider,
    x: value.x === undefined ? undefined : value.x.toISOString(),
    y: value.y
  }
}
