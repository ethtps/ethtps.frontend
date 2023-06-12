import { ApiV3L2DataGetPostRequest, Configuration, L2DataApi, L2DataRequestModelToJSON } from '../../../../api-client'
import * as runtime from '../../../../api-client/src/runtime'
import { NumberedL2DataResponseModel, NumberedL2DataResponseModelFromJSON } from './NumberedL2DataResponseModel'
import { TimedL2DataResponseModel, TimedL2DataResponseModelFromJSON } from './TimedL2DataResponseModel'

export class ExtendedL2DataApi extends L2DataApi {
    constructor(configuration?: Configuration) {
        super(configuration)
    }

    async apiV3L2TimeDataGetPost(
        requestParameters: ApiV3L2DataGetPostRequest = {},
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<TimedL2DataResponseModel> {
        const queryParameters: any = {}

        if (requestParameters.dataType !== undefined) {
            queryParameters['dataType'] = requestParameters.dataType
        }

        const headerParameters: runtime.HTTPHeaders = {}

        headerParameters['Content-Type'] = 'application/json-patch+json'

        if (
            requestParameters.xAPIKey !== undefined &&
            requestParameters.xAPIKey !== null
        ) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey)
        }

        const response = await this.request(
            {
                path: `/api/v3/L2Data/Get`,
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: L2DataRequestModelToJSON(requestParameters.l2DataRequestModel)
            },
            initOverrides)
        return await (new runtime.JSONApiResponse(response, (jsonValue) =>
            TimedL2DataResponseModelFromJSON(jsonValue))).value()
    }

    async apiV3L2NumberedDataGetPost(
        requestParameters: ApiV3L2DataGetPostRequest = {},
        initOverrides?: RequestInit | runtime.InitOverrideFunction
    ): Promise<NumberedL2DataResponseModel> {
        const queryParameters: any = {}

        if (requestParameters.dataType !== undefined) {
            queryParameters['dataType'] = requestParameters.dataType
        }

        const headerParameters: runtime.HTTPHeaders = {}

        headerParameters['Content-Type'] = 'application/json-patch+json'

        if (
            requestParameters.xAPIKey !== undefined &&
            requestParameters.xAPIKey !== null
        ) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey)
        }

        const response = await this.request(
            {
                path: `/api/v3/L2Data/Get`,
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: L2DataRequestModelToJSON(requestParameters.l2DataRequestModel)
            },
            initOverrides)
        return await (new runtime.JSONApiResponse(response, (jsonValue) =>
            NumberedL2DataResponseModelFromJSON(jsonValue))).value()
    }
}