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
 * @interface IMarkdownPage
 */
export interface IMarkdownPage {
  /**
   *
   * @type {string}
   * @memberof IMarkdownPage
   */
  rawMarkdown?: string | null
  /**
   *
   * @type {number}
   * @memberof IMarkdownPage
   */
  id?: number
}

/**
 * Check if a given object implements the IMarkdownPage interface.
 */
export function instanceOfIMarkdownPage(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function IMarkdownPageFromJSON(json: any): IMarkdownPage {
  return IMarkdownPageFromJSONTyped(json, false)
}

export function IMarkdownPageFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): IMarkdownPage {
  if (json === undefined || json === null) {
    return json
  }
  return {
    rawMarkdown: !exists(json, 'rawMarkdown') ? undefined : json['rawMarkdown'],
    id: !exists(json, 'id') ? undefined : json['id']
  }
}

export function IMarkdownPageToJSON(value?: IMarkdownPage | null): any {
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
