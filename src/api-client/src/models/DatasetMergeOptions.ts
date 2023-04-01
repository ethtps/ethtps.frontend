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
 * @interface DatasetMergeOptions
 */
export interface DatasetMergeOptions {
    /**
     * 
     * @type {number}
     * @memberof DatasetMergeOptions
     */
    mergePercentage?: number | null;
    /**
     * 
     * @type {number}
     * @memberof DatasetMergeOptions
     */
    maxCount?: number | null;
}

/**
 * Check if a given object implements the DatasetMergeOptions interface.
 */
export function instanceOfDatasetMergeOptions(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function DatasetMergeOptionsFromJSON(json: any): DatasetMergeOptions {
    return DatasetMergeOptionsFromJSONTyped(json, false);
}

export function DatasetMergeOptionsFromJSONTyped(json: any, ignoreDiscriminator: boolean): DatasetMergeOptions {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'mergePercentage': !exists(json, 'mergePercentage') ? undefined : json['mergePercentage'],
        'maxCount': !exists(json, 'maxCount') ? undefined : json['maxCount'],
    };
}

export function DatasetMergeOptionsToJSON(value?: DatasetMergeOptions | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'mergePercentage': value.mergePercentage,
        'maxCount': value.maxCount,
    };
}

