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
import type { LiveDataUpdaterStatus } from './LiveDataUpdaterStatus'
import {
  LiveDataUpdaterStatusFromJSON,
  LiveDataUpdaterStatusFromJSONTyped,
  LiveDataUpdaterStatusToJSON
} from './LiveDataUpdaterStatus'

/**
 *
 * @export
 * @interface DataUpdaterStatus
 */
export interface DataUpdaterStatus {
  /**
   *
   * @type {number}
   * @memberof DataUpdaterStatus
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof DataUpdaterStatus
   */
  name?: string | null
  /**
   *
   * @type {Array<LiveDataUpdaterStatus>}
   * @memberof DataUpdaterStatus
   */
  readonly liveDataUpdaterStatuses?: Array<LiveDataUpdaterStatus> | null
}

/**
 * Check if a given object implements the DataUpdaterStatus interface.
 */
export function instanceOfDataUpdaterStatus(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function DataUpdaterStatusFromJSON(json: any): DataUpdaterStatus {
  return DataUpdaterStatusFromJSONTyped(json, false)
}

export function DataUpdaterStatusFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): DataUpdaterStatus {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
    liveDataUpdaterStatuses: !exists(json, 'liveDataUpdaterStatuses')
      ? undefined
      : json['liveDataUpdaterStatuses'] === null
      ? null
      : (json['liveDataUpdaterStatuses'] as Array<any>).map(
          LiveDataUpdaterStatusFromJSON
        )
  }
}

export function DataUpdaterStatusToJSON(value?: DataUpdaterStatus | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    name: value.name
  }
}
