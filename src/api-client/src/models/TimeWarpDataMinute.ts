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
import type { Network } from './Network'
import { NetworkFromJSON, NetworkFromJSONTyped, NetworkToJSON } from './Network'
import type { Provider } from './Provider'
import {
  ProviderFromJSON,
  ProviderFromJSONTyped,
  ProviderToJSON
} from './Provider'

/**
 *
 * @export
 * @interface TimeWarpDataMinute
 */
export interface TimeWarpDataMinute {
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  id?: number
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  network?: number
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  provider?: number
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  block?: number | null
  /**
   *
   * @type {Date}
   * @memberof TimeWarpDataMinute
   */
  startDate?: Date
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  averageTps?: number
  /**
   *
   * @type {number}
   * @memberof TimeWarpDataMinute
   */
  averageGps?: number
  /**
   *
   * @type {Network}
   * @memberof TimeWarpDataMinute
   */
  networkNavigation?: Network
  /**
   *
   * @type {Provider}
   * @memberof TimeWarpDataMinute
   */
  providerNavigation?: Provider
}

/**
 * Check if a given object implements the TimeWarpDataMinute interface.
 */
export function instanceOfTimeWarpDataMinute(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function TimeWarpDataMinuteFromJSON(json: any): TimeWarpDataMinute {
  return TimeWarpDataMinuteFromJSONTyped(json, false)
}

export function TimeWarpDataMinuteFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): TimeWarpDataMinute {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    network: !exists(json, 'network') ? undefined : json['network'],
    provider: !exists(json, 'provider') ? undefined : json['provider'],
    block: !exists(json, 'block') ? undefined : json['block'],
    startDate: !exists(json, 'startDate')
      ? undefined
      : new Date(json['startDate']),
    averageTps: !exists(json, 'averageTps') ? undefined : json['averageTps'],
    averageGps: !exists(json, 'averageGps') ? undefined : json['averageGps'],
    networkNavigation: !exists(json, 'networkNavigation')
      ? undefined
      : NetworkFromJSON(json['networkNavigation']),
    providerNavigation: !exists(json, 'providerNavigation')
      ? undefined
      : ProviderFromJSON(json['providerNavigation'])
  }
}

export function TimeWarpDataMinuteToJSON(
  value?: TimeWarpDataMinute | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    network: value.network,
    provider: value.provider,
    block: value.block,
    startDate:
      value.startDate === undefined ? undefined : value.startDate.toISOString(),
    averageTps: value.averageTps,
    averageGps: value.averageGps,
    networkNavigation: NetworkToJSON(value.networkNavigation),
    providerNavigation: ProviderToJSON(value.providerNavigation)
  }
}
