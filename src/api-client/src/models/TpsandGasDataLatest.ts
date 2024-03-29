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
 * @interface TpsandGasDataLatest
 */
export interface TpsandGasDataLatest {
  /**
   *
   * @type {number}
   * @memberof TpsandGasDataLatest
   */
  tps?: number
  /**
   *
   * @type {number}
   * @memberof TpsandGasDataLatest
   */
  gps?: number
  /**
   *
   * @type {number}
   * @memberof TpsandGasDataLatest
   */
  id?: number
  /**
   *
   * @type {number}
   * @memberof TpsandGasDataLatest
   */
  network?: number
  /**
   *
   * @type {number}
   * @memberof TpsandGasDataLatest
   */
  provider?: number
  /**
   *
   * @type {Network}
   * @memberof TpsandGasDataLatest
   */
  networkNavigation?: Network
  /**
   *
   * @type {Provider}
   * @memberof TpsandGasDataLatest
   */
  providerNavigation?: Provider
}

/**
 * Check if a given object implements the TpsandGasDataLatest interface.
 */
export function instanceOfTpsandGasDataLatest(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function TpsandGasDataLatestFromJSON(json: any): TpsandGasDataLatest {
  return TpsandGasDataLatestFromJSONTyped(json, false)
}

export function TpsandGasDataLatestFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): TpsandGasDataLatest {
  if (json === undefined || json === null) {
    return json
  }
  return {
    tps: !exists(json, 'tps') ? undefined : json['tps'],
    gps: !exists(json, 'gps') ? undefined : json['gps'],
    id: !exists(json, 'id') ? undefined : json['id'],
    network: !exists(json, 'network') ? undefined : json['network'],
    provider: !exists(json, 'provider') ? undefined : json['provider'],
    networkNavigation: !exists(json, 'networkNavigation')
      ? undefined
      : NetworkFromJSON(json['networkNavigation']),
    providerNavigation: !exists(json, 'providerNavigation')
      ? undefined
      : ProviderFromJSON(json['providerNavigation'])
  }
}

export function TpsandGasDataLatestToJSON(
  value?: TpsandGasDataLatest | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    tps: value.tps,
    gps: value.gps,
    id: value.id,
    network: value.network,
    provider: value.provider,
    networkNavigation: NetworkToJSON(value.networkNavigation),
    providerNavigation: ProviderToJSON(value.providerNavigation)
  }
}
