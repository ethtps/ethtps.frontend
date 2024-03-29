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
 * @interface IExternalWebsite
 */
export interface IExternalWebsite {
  /**
   *
   * @type {string}
   * @memberof IExternalWebsite
   */
  name?: string | null
  /**
   *
   * @type {string}
   * @memberof IExternalWebsite
   */
  iconBase64?: string | null
  /**
   *
   * @type {number}
   * @memberof IExternalWebsite
   */
  category?: number
  /**
   *
   * @type {number}
   * @memberof IExternalWebsite
   */
  id?: number
}

/**
 * Check if a given object implements the IExternalWebsite interface.
 */
export function instanceOfIExternalWebsite(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function IExternalWebsiteFromJSON(json: any): IExternalWebsite {
  return IExternalWebsiteFromJSONTyped(json, false)
}

export function IExternalWebsiteFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IExternalWebsite {
  if (json === undefined || json === null) {
    return json
  }
  return {
    name: !exists(json, 'name') ? undefined : json['name'],
    iconBase64: !exists(json, 'iconBase64') ? undefined : json['iconBase64'],
    category: !exists(json, 'category') ? undefined : json['category'],
    id: !exists(json, 'id') ? undefined : json['id']
  }
}

export function IExternalWebsiteToJSON(value?: IExternalWebsite | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    name: value.name,
    iconBase64: value.iconBase64,
    category: value.category,
    id: value.id
  }
}
