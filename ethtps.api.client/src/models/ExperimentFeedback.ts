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
import type { Experiment } from './Experiment';
import {
    ExperimentFromJSON,
    ExperimentFromJSONTyped,
    ExperimentToJSON,
} from './Experiment';

/**
 * 
 * @export
 * @interface ExperimentFeedback
 */
export interface ExperimentFeedback {
    /**
     * 
     * @type {number}
     * @memberof ExperimentFeedback
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof ExperimentFeedback
     */
    experiment?: number;
    /**
     * 
     * @type {boolean}
     * @memberof ExperimentFeedback
     */
    vote?: boolean | null;
    /**
     * 
     * @type {number}
     * @memberof ExperimentFeedback
     */
    rating?: number | null;
    /**
     * 
     * @type {string}
     * @memberof ExperimentFeedback
     */
    text?: string | null;
    /**
     * 
     * @type {Experiment}
     * @memberof ExperimentFeedback
     */
    experimentNavigation?: Experiment;
}

/**
 * Check if a given object implements the ExperimentFeedback interface.
 */
export function instanceOfExperimentFeedback(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ExperimentFeedbackFromJSON(json: any): ExperimentFeedback {
    return ExperimentFeedbackFromJSONTyped(json, false);
}

export function ExperimentFeedbackFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExperimentFeedback {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'experiment': !exists(json, 'experiment') ? undefined : json['experiment'],
        'vote': !exists(json, 'vote') ? undefined : json['vote'],
        'rating': !exists(json, 'rating') ? undefined : json['rating'],
        'text': !exists(json, 'text') ? undefined : json['text'],
        'experimentNavigation': !exists(json, 'experimentNavigation') ? undefined : ExperimentFromJSON(json['experimentNavigation']),
    };
}

export function ExperimentFeedbackToJSON(value?: ExperimentFeedback | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'experiment': value.experiment,
        'vote': value.vote,
        'rating': value.rating,
        'text': value.text,
        'experimentNavigation': ExperimentToJSON(value.experimentNavigation),
    };
}
