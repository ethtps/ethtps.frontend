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
import type { Provider } from './Provider'
import {
  ProviderFromJSON,
  ProviderFromJSONTyped,
  ProviderToJSON
} from './Provider'

/**
 *
 * @export
 * @interface ProviderType
 */
export interface ProviderType {
  /**
   *
   * @type {number}
   * @memberof ProviderType
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof ProviderType
   */
  name?: string | null
  /**
   *
   * @type {string}
   * @memberof ProviderType
   */
  color?: string | null
  /**
   *
   * @type {boolean}
   * @memberof ProviderType
   */
  isGeneralPurpose?: boolean
  /**
   *
   * @type {boolean}
   * @memberof ProviderType
   */
  enabled?: boolean
  /**
   *
   * @type {Array<Provider>}
   * @memberof ProviderType
   */
  readonly providers?: Array<Provider> | null
}

/**
 * Check if a given object implements the ProviderType interface.
 */
export function instanceOfProviderType(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ProviderTypeFromJSON(json: any): ProviderType {
  return ProviderTypeFromJSONTyped(json, false)
}

export function ProviderTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ProviderType {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
    color: !exists(json, 'color') ? undefined : json['color'],
    isGeneralPurpose: !exists(json, 'isGeneralPurpose')
      ? undefined
      : json['isGeneralPurpose'],
    enabled: !exists(json, 'enabled') ? undefined : json['enabled'],
    providers: !exists(json, 'providers')
      ? undefined
      : json['providers'] === null
      ? null
      : (json['providers'] as Array<any>).map(ProviderFromJSON)
  }
}

export function ProviderTypeToJSON(value?: ProviderType | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    name: value.name,
    color: value.color,
    isGeneralPurpose: value.isGeneralPurpose,
    enabled: value.enabled
  }
}
