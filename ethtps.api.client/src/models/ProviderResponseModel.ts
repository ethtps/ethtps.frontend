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
import type { IBasicLiveUpdaterStatus } from './IBasicLiveUpdaterStatus';
import {
    IBasicLiveUpdaterStatusFromJSON,
    IBasicLiveUpdaterStatusFromJSONTyped,
    IBasicLiveUpdaterStatusToJSON,
} from './IBasicLiveUpdaterStatus';

/**
 * 
 * @export
 * @interface ProviderResponseModel
 */
export interface ProviderResponseModel {
    /**
     * 
     * @type {string}
     * @memberof ProviderResponseModel
     */
    name?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProviderResponseModel
     */
    color?: string | null;
    /**
     * 
     * @type {number}
     * @memberof ProviderResponseModel
     */
    theoreticalMaxTPS?: number;
    /**
     * 
     * @type {string}
     * @memberof ProviderResponseModel
     */
    type?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ProviderResponseModel
     */
    isGeneralPurpose?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ProviderResponseModel
     */
    isSubchainOf?: string | null;
    /**
     * 
     * @type {IBasicLiveUpdaterStatus}
     * @memberof ProviderResponseModel
     */
    status?: IBasicLiveUpdaterStatus;
}

/**
 * Check if a given object implements the ProviderResponseModel interface.
 */
export function instanceOfProviderResponseModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ProviderResponseModelFromJSON(json: any): ProviderResponseModel {
    return ProviderResponseModelFromJSONTyped(json, false);
}

export function ProviderResponseModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProviderResponseModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': !exists(json, 'name') ? undefined : json['name'],
        'color': !exists(json, 'color') ? undefined : json['color'],
        'theoreticalMaxTPS': !exists(json, 'theoreticalMaxTPS') ? undefined : json['theoreticalMaxTPS'],
        'type': !exists(json, 'type') ? undefined : json['type'],
        'isGeneralPurpose': !exists(json, 'isGeneralPurpose') ? undefined : json['isGeneralPurpose'],
        'isSubchainOf': !exists(json, 'isSubchainOf') ? undefined : json['isSubchainOf'],
        'status': !exists(json, 'status') ? undefined : IBasicLiveUpdaterStatusFromJSON(json['status']),
    };
}

export function ProviderResponseModelToJSON(value?: ProviderResponseModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'color': value.color,
        'theoreticalMaxTPS': value.theoreticalMaxTPS,
        'type': value.type,
        'isGeneralPurpose': value.isGeneralPurpose,
        'isSubchainOf': value.isSubchainOf,
        'status': IBasicLiveUpdaterStatusToJSON(value.status),
    };
}

