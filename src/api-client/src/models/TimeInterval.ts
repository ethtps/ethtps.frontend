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
export const TimeInterval = {
    Instant: 'Instant',
    OneMinute: 'OneMinute',
    OneHour: 'OneHour',
    OneDay: 'OneDay',
    OneWeek: 'OneWeek',
    OneMonth: 'OneMonth',
    OneYear: 'OneYear',
    All: 'All',
    Auto: 'Auto'
} as const;
export type TimeInterval = typeof TimeInterval[keyof typeof TimeInterval];


export function TimeIntervalFromJSON(json: any): TimeInterval {
    return TimeIntervalFromJSONTyped(json, false);
}

export function TimeIntervalFromJSONTyped(json: any, ignoreDiscriminator: boolean): TimeInterval {
    return json as TimeInterval;
}

export function TimeIntervalToJSON(value?: TimeInterval | null): any {
    return value as any;
}

