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
import type { ExternalWebsite } from './ExternalWebsite'
import {
  ExternalWebsiteFromJSON,
  ExternalWebsiteFromJSONTyped,
  ExternalWebsiteToJSON
} from './ExternalWebsite'

/**
 *
 * @export
 * @interface ExternalWebsiteCategory
 */
export interface ExternalWebsiteCategory {
  /**
   *
   * @type {number}
   * @memberof ExternalWebsiteCategory
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof ExternalWebsiteCategory
   */
  name?: string | null
  /**
   *
   * @type {Array<ExternalWebsite>}
   * @memberof ExternalWebsiteCategory
   */
  readonly externalWebsites?: Array<ExternalWebsite> | null
}

/**
 * Check if a given object implements the ExternalWebsiteCategory interface.
 */
export function instanceOfExternalWebsiteCategory(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ExternalWebsiteCategoryFromJSON(
  json: any
): ExternalWebsiteCategory {
  return ExternalWebsiteCategoryFromJSONTyped(json, false)
}

export function ExternalWebsiteCategoryFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ExternalWebsiteCategory {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
    externalWebsites: !exists(json, 'externalWebsites')
      ? undefined
      : json['externalWebsites'] === null
      ? null
      : (json['externalWebsites'] as Array<any>).map(ExternalWebsiteFromJSON)
  }
}

export function ExternalWebsiteCategoryToJSON(
  value?: ExternalWebsiteCategory | null
): any {
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
