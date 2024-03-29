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
import type { MarkdownPage } from './MarkdownPage'
import {
  MarkdownPageFromJSON,
  MarkdownPageFromJSONTyped,
  MarkdownPageToJSON
} from './MarkdownPage'
import type { Provider } from './Provider'
import {
  ProviderFromJSON,
  ProviderFromJSONTyped,
  ProviderToJSON
} from './Provider'

/**
 *
 * @export
 * @interface ProviderDetailsMarkdownPage
 */
export interface ProviderDetailsMarkdownPage {
  /**
   *
   * @type {number}
   * @memberof ProviderDetailsMarkdownPage
   */
  id?: number
  /**
   *
   * @type {number}
   * @memberof ProviderDetailsMarkdownPage
   */
  providerId?: number
  /**
   *
   * @type {number}
   * @memberof ProviderDetailsMarkdownPage
   */
  markdownPageId?: number
  /**
   *
   * @type {MarkdownPage}
   * @memberof ProviderDetailsMarkdownPage
   */
  markdownPage?: MarkdownPage
  /**
   *
   * @type {Provider}
   * @memberof ProviderDetailsMarkdownPage
   */
  provider?: Provider
}

/**
 * Check if a given object implements the ProviderDetailsMarkdownPage interface.
 */
export function instanceOfProviderDetailsMarkdownPage(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ProviderDetailsMarkdownPageFromJSON(
  json: any
): ProviderDetailsMarkdownPage {
  return ProviderDetailsMarkdownPageFromJSONTyped(json, false)
}

export function ProviderDetailsMarkdownPageFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ProviderDetailsMarkdownPage {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    providerId: !exists(json, 'providerId') ? undefined : json['providerId'],
    markdownPageId: !exists(json, 'markdownPageId')
      ? undefined
      : json['markdownPageId'],
    markdownPage: !exists(json, 'markdownPage')
      ? undefined
      : MarkdownPageFromJSON(json['markdownPage']),
    provider: !exists(json, 'provider')
      ? undefined
      : ProviderFromJSON(json['provider'])
  }
}

export function ProviderDetailsMarkdownPageToJSON(
  value?: ProviderDetailsMarkdownPage | null
): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    providerId: value.providerId,
    markdownPageId: value.markdownPageId,
    markdownPage: MarkdownPageToJSON(value.markdownPage),
    provider: ProviderToJSON(value.provider)
  }
}
