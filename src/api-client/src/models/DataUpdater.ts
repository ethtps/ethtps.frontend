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
import type { DataUpdaterType } from './DataUpdaterType'
import {
  DataUpdaterTypeFromJSON,
  DataUpdaterTypeFromJSONTyped,
  DataUpdaterTypeToJSON
} from './DataUpdaterType'
import type { LiveDataUpdaterStatus } from './LiveDataUpdaterStatus'
import {
  LiveDataUpdaterStatusFromJSON,
  LiveDataUpdaterStatusFromJSONTyped,
  LiveDataUpdaterStatusToJSON
} from './LiveDataUpdaterStatus'
import type { Provider } from './Provider'
import {
  ProviderFromJSON,
  ProviderFromJSONTyped,
  ProviderToJSON
} from './Provider'

/**
 *
 * @export
 * @interface DataUpdater
 */
export interface DataUpdater {
  /**
   *
   * @type {number}
   * @memberof DataUpdater
   */
  id?: number
  /**
   *
   * @type {number}
   * @memberof DataUpdater
   */
  typeId?: number
  /**
   *
   * @type {number}
   * @memberof DataUpdater
   */
  providerId?: number
  /**
   *
   * @type {Array<LiveDataUpdaterStatus>}
   * @memberof DataUpdater
   */
  readonly liveDataUpdaterStatuses?: Array<LiveDataUpdaterStatus> | null
  /**
   *
   * @type {Provider}
   * @memberof DataUpdater
   */
  provider?: Provider
  /**
   *
   * @type {DataUpdaterType}
   * @memberof DataUpdater
   */
  type?: DataUpdaterType
}

/**
 * Check if a given object implements the DataUpdater interface.
 */
export function instanceOfDataUpdater(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function DataUpdaterFromJSON(json: any): DataUpdater {
  return DataUpdaterFromJSONTyped(json, false)
}

export function DataUpdaterFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DataUpdater {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    typeId: !exists(json, 'typeId') ? undefined : json['typeId'],
    providerId: !exists(json, 'providerId') ? undefined : json['providerId'],
    liveDataUpdaterStatuses: !exists(json, 'liveDataUpdaterStatuses')
      ? undefined
      : json['liveDataUpdaterStatuses'] === null
      ? null
      : (json['liveDataUpdaterStatuses'] as Array<any>).map(
          LiveDataUpdaterStatusFromJSON
        ),
    provider: !exists(json, 'provider')
      ? undefined
      : ProviderFromJSON(json['provider']),
    type: !exists(json, 'type')
      ? undefined
      : DataUpdaterTypeFromJSON(json['type'])
  }
}

export function DataUpdaterToJSON(value?: DataUpdater | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    typeId: value.typeId,
    providerId: value.providerId,
    provider: ProviderToJSON(value.provider),
    type: DataUpdaterTypeToJSON(value.type)
  }
}
