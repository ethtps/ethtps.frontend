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
import type { BucketOptions } from './BucketOptions';
import {
    BucketOptionsFromJSON,
    BucketOptionsFromJSONTyped,
    BucketOptionsToJSON,
} from './BucketOptions';
import type { DatasetMergeOptions } from './DatasetMergeOptions';
import {
    DatasetMergeOptionsFromJSON,
    DatasetMergeOptionsFromJSONTyped,
    DatasetMergeOptionsToJSON,
} from './DatasetMergeOptions';
import type { XPointType } from './XPointType';
import {
    XPointTypeFromJSON,
    XPointTypeFromJSONTyped,
    XPointTypeToJSON,
} from './XPointType';

/**
 * 
 * @export
 * @interface L2DataRequestModel
 */
export interface L2DataRequestModel {
    /**
     * 
     * @type {Date}
     * @memberof L2DataRequestModel
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof L2DataRequestModel
     */
    endDate?: Date | null;
    /**
     * 
     * @type {BucketOptions}
     * @memberof L2DataRequestModel
     */
    bucketOptions?: BucketOptions;
    /**
     * 
     * @type {XPointType}
     * @memberof L2DataRequestModel
     */
    returnXAxisType?: XPointType;
    /**
     * 
     * @type {boolean}
     * @memberof L2DataRequestModel
     */
    includeEmptyDatasets?: boolean;
    /**
     * 
     * @type {DatasetMergeOptions}
     * @memberof L2DataRequestModel
     */
    mergeOptions?: DatasetMergeOptions;
    /**
     * 
     * @type {boolean}
     * @memberof L2DataRequestModel
     */
    includeSimpleAnalysis?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof L2DataRequestModel
     */
    includeComplexAnalysis?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof L2DataRequestModel
     */
    providers?: Array<string> | null;
    /**
     * 
     * @type {string}
     * @memberof L2DataRequestModel
     */
    provider?: string | null;
    /**
     * 
     * @type {string}
     * @memberof L2DataRequestModel
     */
    network?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof L2DataRequestModel
     */
    includeSidechains?: boolean;
}

/**
 * Check if a given object implements the L2DataRequestModel interface.
 */
export function instanceOfL2DataRequestModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function L2DataRequestModelFromJSON(json: any): L2DataRequestModel {
    return L2DataRequestModelFromJSONTyped(json, false);
}

export function L2DataRequestModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): L2DataRequestModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'startDate': !exists(json, 'startDate') ? undefined : (json['startDate'] === null ? null : new Date(json['startDate'])),
        'endDate': !exists(json, 'endDate') ? undefined : (json['endDate'] === null ? null : new Date(json['endDate'])),
        'bucketOptions': !exists(json, 'bucketOptions') ? undefined : BucketOptionsFromJSON(json['bucketOptions']),
        'returnXAxisType': !exists(json, 'returnXAxisType') ? undefined : XPointTypeFromJSON(json['returnXAxisType']),
        'includeEmptyDatasets': !exists(json, 'includeEmptyDatasets') ? undefined : json['includeEmptyDatasets'],
        'mergeOptions': !exists(json, 'mergeOptions') ? undefined : DatasetMergeOptionsFromJSON(json['mergeOptions']),
        'includeSimpleAnalysis': !exists(json, 'includeSimpleAnalysis') ? undefined : json['includeSimpleAnalysis'],
        'includeComplexAnalysis': !exists(json, 'includeComplexAnalysis') ? undefined : json['includeComplexAnalysis'],
        'providers': !exists(json, 'providers') ? undefined : json['providers'],
        'provider': !exists(json, 'provider') ? undefined : json['provider'],
        'network': !exists(json, 'network') ? undefined : json['network'],
        'includeSidechains': !exists(json, 'includeSidechains') ? undefined : json['includeSidechains'],
    };
}

export function L2DataRequestModelToJSON(value?: L2DataRequestModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'startDate': value.startDate === undefined ? undefined : (value.startDate === null ? null : value.startDate.toISOString()),
        'endDate': value.endDate === undefined ? undefined : (value.endDate === null ? null : value.endDate.toISOString()),
        'bucketOptions': BucketOptionsToJSON(value.bucketOptions),
        'returnXAxisType': XPointTypeToJSON(value.returnXAxisType),
        'includeEmptyDatasets': value.includeEmptyDatasets,
        'mergeOptions': DatasetMergeOptionsToJSON(value.mergeOptions),
        'includeSimpleAnalysis': value.includeSimpleAnalysis,
        'includeComplexAnalysis': value.includeComplexAnalysis,
        'providers': value.providers,
        'provider': value.provider,
        'network': value.network,
        'includeSidechains': value.includeSidechains,
    };
}

