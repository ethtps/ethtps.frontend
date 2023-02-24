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


import * as runtime from '../runtime';
import type {
  LiveUpdaterStatus,
} from '../models';
import {
    LiveUpdaterStatusFromJSON,
    LiveUpdaterStatusToJSON,
} from '../models';

export interface ApiV3UpdaterStatusGetAllStatusesGetRequest {
    xAPIKey?: string;
}

export interface ApiV3UpdaterStatusGetStatusForGetRequest {
    xAPIKey?: string;
    provider?: string;
    updaterType?: string;
}

export interface ApiV3UpdaterStatusGetStatusesForGetRequest {
    xAPIKey?: string;
    provider?: string;
}

/**
 * 
 */
export class UpdaterStatusApi extends runtime.BaseAPI {

    /**
     */
    async apiV3UpdaterStatusGetAllStatusesGetRaw(requestParameters: ApiV3UpdaterStatusGetAllStatusesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<LiveUpdaterStatus>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/updater-status/GetAllStatuses`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(LiveUpdaterStatusFromJSON));
    }

    /**
     */
    async apiV3UpdaterStatusGetAllStatusesGet(requestParameters: ApiV3UpdaterStatusGetAllStatusesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<LiveUpdaterStatus>> {
        const response = await this.apiV3UpdaterStatusGetAllStatusesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiV3UpdaterStatusGetStatusForGetRaw(requestParameters: ApiV3UpdaterStatusGetStatusForGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<LiveUpdaterStatus>> {
        const queryParameters: any = {};

        if (requestParameters.provider !== undefined) {
            queryParameters['provider'] = requestParameters.provider;
        }

        if (requestParameters.updaterType !== undefined) {
            queryParameters['updaterType'] = requestParameters.updaterType;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/updater-status/GetStatusFor`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LiveUpdaterStatusFromJSON(jsonValue));
    }

    /**
     */
    async apiV3UpdaterStatusGetStatusForGet(requestParameters: ApiV3UpdaterStatusGetStatusForGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<LiveUpdaterStatus> {
        const response = await this.apiV3UpdaterStatusGetStatusForGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiV3UpdaterStatusGetStatusesForGetRaw(requestParameters: ApiV3UpdaterStatusGetStatusesForGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<LiveUpdaterStatus>>> {
        const queryParameters: any = {};

        if (requestParameters.provider !== undefined) {
            queryParameters['provider'] = requestParameters.provider;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/updater-status/GetStatusesFor`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(LiveUpdaterStatusFromJSON));
    }

    /**
     */
    async apiV3UpdaterStatusGetStatusesForGet(requestParameters: ApiV3UpdaterStatusGetStatusesForGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<LiveUpdaterStatus>> {
        const response = await this.apiV3UpdaterStatusGetStatusesForGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
