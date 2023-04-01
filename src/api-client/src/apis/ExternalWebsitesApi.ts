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
  IExternalWebsite,
  IProviderExternalWebsite,
} from '../models';
import {
    IExternalWebsiteFromJSON,
    IExternalWebsiteToJSON,
    IProviderExternalWebsiteFromJSON,
    IProviderExternalWebsiteToJSON,
} from '../models';

export interface ApiV3ExternalWebsitesCreatePostRequest {
    xAPIKey?: string;
    iExternalWebsite?: IExternalWebsite;
}

export interface ApiV3ExternalWebsitesDeleteByIdDeleteRequest {
    xAPIKey?: string;
    id?: number;
}

export interface ApiV3ExternalWebsitesGetRequest {
    xAPIKey?: string;
    providerName?: string;
}

export interface ApiV3ExternalWebsitesGetAllGetRequest {
    xAPIKey?: string;
}

export interface ApiV3ExternalWebsitesGetByIdGetRequest {
    xAPIKey?: string;
    id?: number;
}

export interface ApiV3ExternalWebsitesUpdatePutRequest {
    xAPIKey?: string;
    iExternalWebsite?: IExternalWebsite;
}

/**
 * 
 */
export class ExternalWebsitesApi extends runtime.BaseAPI {

    /**
     */
    async apiV3ExternalWebsitesCreatePostRaw(requestParameters: ApiV3ExternalWebsitesCreatePostRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json-patch+json';

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites/Create`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IExternalWebsiteToJSON(requestParameters.iExternalWebsite),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiV3ExternalWebsitesCreatePost(requestParameters: ApiV3ExternalWebsitesCreatePostRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV3ExternalWebsitesCreatePostRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiV3ExternalWebsitesDeleteByIdDeleteRaw(requestParameters: ApiV3ExternalWebsitesDeleteByIdDeleteRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.id !== undefined) {
            queryParameters['id'] = requestParameters.id;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites/DeleteById`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiV3ExternalWebsitesDeleteByIdDelete(requestParameters: ApiV3ExternalWebsitesDeleteByIdDeleteRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV3ExternalWebsitesDeleteByIdDeleteRaw(requestParameters, initOverrides);
    }

    /**
     */
    async apiV3ExternalWebsitesGetRaw(requestParameters: ApiV3ExternalWebsitesGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<IProviderExternalWebsite>>> {
        const queryParameters: any = {};

        if (requestParameters.providerName !== undefined) {
            queryParameters['providerName'] = requestParameters.providerName;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IProviderExternalWebsiteFromJSON));
    }

    /**
     */
    async apiV3ExternalWebsitesGet(requestParameters: ApiV3ExternalWebsitesGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<IProviderExternalWebsite>> {
        const response = await this.apiV3ExternalWebsitesGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiV3ExternalWebsitesGetAllGetRaw(requestParameters: ApiV3ExternalWebsitesGetAllGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<IExternalWebsite>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites/GetAll`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(IExternalWebsiteFromJSON));
    }

    /**
     */
    async apiV3ExternalWebsitesGetAllGet(requestParameters: ApiV3ExternalWebsitesGetAllGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<IExternalWebsite>> {
        const response = await this.apiV3ExternalWebsitesGetAllGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiV3ExternalWebsitesGetByIdGetRaw(requestParameters: ApiV3ExternalWebsitesGetByIdGetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IExternalWebsite>> {
        const queryParameters: any = {};

        if (requestParameters.id !== undefined) {
            queryParameters['id'] = requestParameters.id;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites/GetById`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IExternalWebsiteFromJSON(jsonValue));
    }

    /**
     */
    async apiV3ExternalWebsitesGetByIdGet(requestParameters: ApiV3ExternalWebsitesGetByIdGetRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IExternalWebsite> {
        const response = await this.apiV3ExternalWebsitesGetByIdGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async apiV3ExternalWebsitesUpdatePutRaw(requestParameters: ApiV3ExternalWebsitesUpdatePutRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json-patch+json';

        if (requestParameters.xAPIKey !== undefined && requestParameters.xAPIKey !== null) {
            headerParameters['X-API-Key'] = String(requestParameters.xAPIKey);
        }

        const response = await this.request({
            path: `/api/v3/external-websites/Update`,
            method: 'PUT',
            headers: headerParameters,
            query: queryParameters,
            body: IExternalWebsiteToJSON(requestParameters.iExternalWebsite),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     */
    async apiV3ExternalWebsitesUpdatePut(requestParameters: ApiV3ExternalWebsitesUpdatePutRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.apiV3ExternalWebsitesUpdatePutRaw(requestParameters, initOverrides);
    }

}
