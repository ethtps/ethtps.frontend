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
import type { Experiment } from './Experiment'
import {
  ExperimentFromJSON,
  ExperimentFromJSONTyped,
  ExperimentToJSON
} from './Experiment'
import type { ExperimentTargetType } from './ExperimentTargetType'
import {
  ExperimentTargetTypeFromJSON,
  ExperimentTargetTypeFromJSONTyped,
  ExperimentTargetTypeToJSON
} from './ExperimentTargetType'

/**
 *
 * @export
 * @interface ExperimentTarget
 */
export interface ExperimentTarget {
  /**
   *
   * @type {number}
   * @memberof ExperimentTarget
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof ExperimentTarget
   */
  name?: string | null
  /**
   *
   * @type {string}
   * @memberof ExperimentTarget
   */
  description?: string | null
  /**
   *
   * @type {number}
   * @memberof ExperimentTarget
   */
  type?: number
  /**
   *
   * @type {Array<Experiment>}
   * @memberof ExperimentTarget
   */
  readonly experiments?: Array<Experiment> | null
  /**
   *
   * @type {ExperimentTargetType}
   * @memberof ExperimentTarget
   */
  typeNavigation?: ExperimentTargetType
}

/**
 * Check if a given object implements the ExperimentTarget interface.
 */
export function instanceOfExperimentTarget(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ExperimentTargetFromJSON(json: any): ExperimentTarget {
  return ExperimentTargetFromJSONTyped(json, false)
}

export function ExperimentTargetFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ExperimentTarget {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
    description: !exists(json, 'description') ? undefined : json['description'],
    type: !exists(json, 'type') ? undefined : json['type'],
    experiments: !exists(json, 'experiments')
      ? undefined
      : json['experiments'] === null
      ? null
      : (json['experiments'] as Array<any>).map(ExperimentFromJSON),
    typeNavigation: !exists(json, 'typeNavigation')
      ? undefined
      : ExperimentTargetTypeFromJSON(json['typeNavigation'])
  }
}

export function ExperimentTargetToJSON(value?: ExperimentTarget | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    id: value.id,
    name: value.name,
    description: value.description,
    type: value.type,
    typeNavigation: ExperimentTargetTypeToJSON(value.typeNavigation)
  }
}
