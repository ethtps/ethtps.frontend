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
 * @interface StringXYDataPoint
 */
export interface StringXYDataPoint {
    /**
     * 
     * @type {string}
     * @memberof StringXYDataPoint
     */
    x?: string | null;
    /**
     * 
     * @type {number}
     * @memberof StringXYDataPoint
     */
    y?: number;
}

/**
 * Check if a given object implements the StringXYDataPoint interface.
 */
export function instanceOfStringXYDataPoint(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function StringXYDataPointFromJSON(json: any): StringXYDataPoint {
    return StringXYDataPointFromJSONTyped(json, false);
}

export function StringXYDataPointFromJSONTyped(json: any, ignoreDiscriminator: boolean): StringXYDataPoint {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'x': !exists(json, 'x') ? undefined : json['x'],
        'y': !exists(json, 'y') ? undefined : json['y'],
    };
}

export function StringXYDataPointToJSON(value?: StringXYDataPoint | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'x': value.x,
        'y': value.y,
    };
}

