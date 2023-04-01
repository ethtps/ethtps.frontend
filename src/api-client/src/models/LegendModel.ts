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
/**
 * 
 * @export
 * @interface LegendModel
 */
export interface LegendModel {
    /**
     * 
     * @type {Array<string>}
     * @memberof LegendModel
     */
    keys?: Array<string> | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof LegendModel
     */
    colors?: Array<string> | null;
}

/**
 * Check if a given object implements the LegendModel interface.
 */
export function instanceOfLegendModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function LegendModelFromJSON(json: any): LegendModel {
    return LegendModelFromJSONTyped(json, false);
}

export function LegendModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): LegendModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'keys': !exists(json, 'keys') ? undefined : json['keys'],
        'colors': !exists(json, 'colors') ? undefined : json['colors'],
    };
}

export function LegendModelToJSON(value?: LegendModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'keys': value.keys,
        'colors': value.colors,
    };
}

