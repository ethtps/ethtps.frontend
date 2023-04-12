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

import { exists, mapValues } from '../runtime';
import type { Permission } from './Permission';
import {
    PermissionFromJSON,
    PermissionFromJSONTyped,
    PermissionToJSON,
} from './Permission';
import type { Role } from './Role';
import {
    RoleFromJSON,
    RoleFromJSONTyped,
    RoleToJSON,
} from './Role';

/**
 * 
 * @export
 * @interface PermissionsForRole
 */
export interface PermissionsForRole {
    /**
     * 
     * @type {number}
     * @memberof PermissionsForRole
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof PermissionsForRole
     */
    roleId?: number;
    /**
     * 
     * @type {number}
     * @memberof PermissionsForRole
     */
    permissionId?: number;
    /**
     * 
     * @type {Permission}
     * @memberof PermissionsForRole
     */
    permission?: Permission;
    /**
     * 
     * @type {Role}
     * @memberof PermissionsForRole
     */
    role?: Role;
}

/**
 * Check if a given object implements the PermissionsForRole interface.
 */
export function instanceOfPermissionsForRole(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function PermissionsForRoleFromJSON(json: any): PermissionsForRole {
    return PermissionsForRoleFromJSONTyped(json, false);
}

export function PermissionsForRoleFromJSONTyped(json: any, ignoreDiscriminator: boolean): PermissionsForRole {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'roleId': !exists(json, 'roleId') ? undefined : json['roleId'],
        'permissionId': !exists(json, 'permissionId') ? undefined : json['permissionId'],
        'permission': !exists(json, 'permission') ? undefined : PermissionFromJSON(json['permission']),
        'role': !exists(json, 'role') ? undefined : RoleFromJSON(json['role']),
    };
}

export function PermissionsForRoleToJSON(value?: PermissionsForRole | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'roleId': value.roleId,
        'permissionId': value.permissionId,
        'permission': PermissionToJSON(value.permission),
        'role': RoleToJSON(value.role),
    };
}
