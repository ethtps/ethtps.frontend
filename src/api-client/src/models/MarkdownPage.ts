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
import type { ProviderDetailsMarkdownPage } from './ProviderDetailsMarkdownPage'
import {
  ProviderDetailsMarkdownPageFromJSON,
  ProviderDetailsMarkdownPageFromJSONTyped,
  ProviderDetailsMarkdownPageToJSON
} from './ProviderDetailsMarkdownPage'

/**
 *
 * @export
 * @interface MarkdownPage
 */
export interface MarkdownPage {
  /**
   *
   * @type {Array<ProviderDetailsMarkdownPage>}
   * @memberof MarkdownPage
   */
  readonly providerDetailsMarkdownPages?: Array<ProviderDetailsMarkdownPage> | null
  /**
   *
   * @type {string}
   * @memberof MarkdownPage
   */
  rawMarkdown?: string | null
  /**
   *
   * @type {number}
   * @memberof MarkdownPage
   */
  id?: number
}

/**
 * Check if a given object implements the MarkdownPage interface.
 */
export function instanceOfMarkdownPage(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function MarkdownPageFromJSON(json: any): MarkdownPage {
  return MarkdownPageFromJSONTyped(json, false)
}

export function MarkdownPageFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): MarkdownPage {
  if (json === undefined || json === null) {
    return json
  }
  return {
    providerDetailsMarkdownPages: !exists(json, 'providerDetailsMarkdownPages')
      ? undefined
      : json['providerDetailsMarkdownPages'] === null
      ? null
      : (json['providerDetailsMarkdownPages'] as Array<any>).map(
          ProviderDetailsMarkdownPageFromJSON
        ),
    rawMarkdown: !exists(json, 'rawMarkdown') ? undefined : json['rawMarkdown'],
    id: !exists(json, 'id') ? undefined : json['id']
  }
}

export function MarkdownPageToJSON(value?: MarkdownPage | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    rawMarkdown: value.rawMarkdown,
    id: value.id
  }
}
