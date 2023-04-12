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

/**
 *
 * @export
 */
export const XPointType = {
  Date: 'Date',
  Number: 'Number',
  String: 'String'
} as const
export type XPointType = (typeof XPointType)[keyof typeof XPointType]

export function XPointTypeFromJSON(json: any): XPointType {
  return XPointTypeFromJSONTyped(json, false)
}

export function XPointTypeFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): XPointType {
  return json as XPointType
}

export function XPointTypeToJSON(value?: XPointType | null): any {
  return value as any
}
