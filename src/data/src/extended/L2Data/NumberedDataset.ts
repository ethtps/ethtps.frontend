
import type { ComplexDatasetAnalysis, NumericXYDataPoint, SimpleDatasetAnalysis } from '../../../../api-client'
import {
    ComplexDatasetAnalysisFromJSON,
    ComplexDatasetAnalysisToJSON,
    NumericXYDataPointFromJSON,
    NumericXYDataPointToJSON, SimpleDatasetAnalysisFromJSON,
    SimpleDatasetAnalysisToJSON, exists
} from '../../../../api-client'

/**
 *
 * @export
 * @interface NumberedDataset
 */
export interface NumberedDataset {
    /**
     *
     * @type {Array<NumericXYDataPoint>}
     * @memberof NumberedDataset
     */
    dataPoints?: Array<NumericXYDataPoint> | null
    /**
     *
     * @type {string}
     * @memberof NumberedDataset
     */
    provider?: string | null
    /**
     *
     * @type {SimpleDatasetAnalysis}
     * @memberof NumberedDataset
     */
    simpleAnalysis?: SimpleDatasetAnalysis
    /**
     *
     * @type {ComplexDatasetAnalysis}
     * @memberof NumberedDataset
     */
    complexAnalysis?: ComplexDatasetAnalysis
}


export function NumberedDatasetFromJSON(json: any): NumberedDataset {
    return NumberedDatasetFromJSONTyped(json, false)
}

export function NumberedDatasetFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean
): NumberedDataset {
    if (json === undefined || json === null) {
        return json
    }
    return {
        dataPoints: !exists(json, 'dataPoints')
            ? undefined
            : json['dataPoints'] === null
                ? null
                : (json['dataPoints'] as Array<any>).map(NumericXYDataPointFromJSON),
        provider: !exists(json, 'provider') ? undefined : json['provider'],
        simpleAnalysis: !exists(json, 'simpleAnalysis')
            ? undefined
            : SimpleDatasetAnalysisFromJSON(json['simpleAnalysis']),
        complexAnalysis: !exists(json, 'complexAnalysis')
            ? undefined
            : ComplexDatasetAnalysisFromJSON(json['complexAnalysis'])
    }
}

export function NumberedDatasetToJSON(value?: NumberedDataset | null): any {
    if (value === undefined) {
        return undefined
    }
    if (value === null) {
        return null
    }
    return {
        dataPoints:
            value.dataPoints === undefined
                ? undefined
                : value.dataPoints === null
                    ? null
                    : (value.dataPoints as Array<any>).map(NumericXYDataPointToJSON),
        provider: value.provider,
        simpleAnalysis: SimpleDatasetAnalysisToJSON(value.simpleAnalysis),
        complexAnalysis: ComplexDatasetAnalysisToJSON(value.complexAnalysis)
    }
}
