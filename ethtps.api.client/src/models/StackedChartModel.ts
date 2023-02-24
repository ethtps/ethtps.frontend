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
import type { StackedChartSeries } from './StackedChartSeries';
import {
    StackedChartSeriesFromJSON,
    StackedChartSeriesFromJSONTyped,
    StackedChartSeriesToJSON,
} from './StackedChartSeries';

/**
 * 
 * @export
 * @interface StackedChartModel
 */
export interface StackedChartModel {
    /**
     * 
     * @type {Array<StackedChartSeries>}
     * @memberof StackedChartModel
     */
    series?: Array<StackedChartSeries> | null;
    /**
     * 
     * @type {number}
     * @memberof StackedChartModel
     */
    readonly maxValue?: number;
}

/**
 * Check if a given object implements the StackedChartModel interface.
 */
export function instanceOfStackedChartModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function StackedChartModelFromJSON(json: any): StackedChartModel {
    return StackedChartModelFromJSONTyped(json, false);
}

export function StackedChartModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): StackedChartModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'series': !exists(json, 'series') ? undefined : (json['series'] === null ? null : (json['series'] as Array<any>).map(StackedChartSeriesFromJSON)),
        'maxValue': !exists(json, 'maxValue') ? undefined : json['maxValue'],
    };
}

export function StackedChartModelToJSON(value?: StackedChartModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'series': value.series === undefined ? undefined : (value.series === null ? null : (value.series as Array<any>).map(StackedChartSeriesToJSON)),
    };
}

