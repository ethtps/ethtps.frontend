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
import type { GroupRole } from './GroupRole'
import {
  GroupRoleFromJSON,
  GroupRoleFromJSONTyped,
  GroupRoleToJSON
} from './GroupRole'
import type { PermissionsForRole } from './PermissionsForRole'
import {
  PermissionsForRoleFromJSON,
  PermissionsForRoleFromJSONTyped,
  PermissionsForRoleToJSON
} from './PermissionsForRole'

/**
 *
 * @export
 * @interface Role
 */
export interface Role {
  /**
   *
   * @type {number}
   * @memberof Role
   */
  id?: number
  /**
   *
   * @type {string}
   * @memberof Role
   */
  name?: string | null
  /**
   *
   * @type {Array<GroupRole>}
   * @memberof Role
   */
  readonly groupRoles?: Array<GroupRole> | null
  /**
   *
   * @type {Array<PermissionsForRole>}
   * @memberof Role
   */
  readonly permissionsForRoles?: Array<PermissionsForRole> | null
}

/**
 * Check if a given object implements the Role interface.
 */
export function instanceOfRole(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function RoleFromJSON(json: any): Role {
  return RoleFromJSONTyped(json, false)
}

export function RoleFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Role {
  if (json === undefined || json === null) {
    return json
  }
  return {
    id: !exists(json, 'id') ? undefined : json['id'],
    name: !exists(json, 'name') ? undefined : json['name'],
    groupRoles: !exists(json, 'groupRoles')
      ? undefined
      : json['groupRoles'] === null
      ? null
      : (json['groupRoles'] as Array<any>).map(GroupRoleFromJSON),
    permissionsForRoles: !exists(json, 'permissionsForRoles')
      ? undefined
      : json['permissionsForRoles'] === null
      ? null
      : (json['permissionsForRoles'] as Array<any>).map(
          PermissionsForRoleFromJSON
        )
  }
}

export function RoleToJSON(value?: Role | null): any {
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
