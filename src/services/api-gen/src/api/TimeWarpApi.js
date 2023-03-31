/**
 * ETHTPS.API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */


import ApiClient from "../ApiClient";
import DataPoint from '../model/DataPoint';
import TimeWarpSyncProgressModel from '../model/TimeWarpSyncProgressModel';

/**
* TimeWarp service.
* @module api/TimeWarpApi
* @version 1.0
*/
export default class TimeWarpApi {

    /**
    * Constructs a new TimeWarpApi. 
    * @alias module:api/TimeWarpApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the aPITimeWarpGetEarliestDateGet operation.
     * @callback module:api/TimeWarpApi~aPITimeWarpGetEarliestDateGetCallback
     * @param {String} error Error message, if any.
     * @param {Date} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {module:api/TimeWarpApi~aPITimeWarpGetEarliestDateGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Date}
     */
    aPITimeWarpGetEarliestDateGet(callback) {
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/json', 'text/json'];
      let returnType = 'Date';
      return this.apiClient.callApi(
        '/API/TimeWarp/GetEarliestDate', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the aPITimeWarpGetGPSAtGet operation.
     * @callback module:api/TimeWarpApi~aPITimeWarpGetGPSAtGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/DataPoint>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.provider 
     * @param {String} opts.network 
     * @param {Boolean} opts.includeSidechains 
     * @param {Number} opts.timestamp 
     * @param {String} opts.smoothing  (default to 'Instant')
     * @param {Number} opts.count  (default to 30)
     * @param {module:api/TimeWarpApi~aPITimeWarpGetGPSAtGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/DataPoint>}
     */
    aPITimeWarpGetGPSAtGet(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'Provider': opts['provider'],
        'Network': opts['network'],
        'IncludeSidechains': opts['includeSidechains'],
        'timestamp': opts['timestamp'],
        'smoothing': opts['smoothing'],
        'count': opts['count']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/json', 'text/json'];
      let returnType = [DataPoint];
      return this.apiClient.callApi(
        '/API/TimeWarp/GetGPSAt', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the aPITimeWarpGetGasAdjustedTPSAtGet operation.
     * @callback module:api/TimeWarpApi~aPITimeWarpGetGasAdjustedTPSAtGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/DataPoint>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.provider 
     * @param {String} opts.network 
     * @param {Boolean} opts.includeSidechains 
     * @param {Number} opts.timestamp 
     * @param {String} opts.smoothing  (default to 'Instant')
     * @param {Number} opts.count  (default to 30)
     * @param {module:api/TimeWarpApi~aPITimeWarpGetGasAdjustedTPSAtGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/DataPoint>}
     */
    aPITimeWarpGetGasAdjustedTPSAtGet(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'Provider': opts['provider'],
        'Network': opts['network'],
        'IncludeSidechains': opts['includeSidechains'],
        'timestamp': opts['timestamp'],
        'smoothing': opts['smoothing'],
        'count': opts['count']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/json', 'text/json'];
      let returnType = [DataPoint];
      return this.apiClient.callApi(
        '/API/TimeWarp/GetGasAdjustedTPSAt', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the aPITimeWarpGetSyncProgressGet operation.
     * @callback module:api/TimeWarpApi~aPITimeWarpGetSyncProgressGetCallback
     * @param {String} error Error message, if any.
     * @param {module:model/TimeWarpSyncProgressModel} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.provider 
     * @param {String} opts.network 
     * @param {Boolean} opts.includeSidechains 
     * @param {module:api/TimeWarpApi~aPITimeWarpGetSyncProgressGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/TimeWarpSyncProgressModel}
     */
    aPITimeWarpGetSyncProgressGet(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'Provider': opts['provider'],
        'Network': opts['network'],
        'IncludeSidechains': opts['includeSidechains']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/json', 'text/json'];
      let returnType = TimeWarpSyncProgressModel;
      return this.apiClient.callApi(
        '/API/TimeWarp/GetSyncProgress', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the aPITimeWarpGetTPSAtGet operation.
     * @callback module:api/TimeWarpApi~aPITimeWarpGetTPSAtGetCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/DataPoint>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.provider 
     * @param {String} opts.network 
     * @param {Boolean} opts.includeSidechains 
     * @param {Number} opts.timestamp 
     * @param {String} opts.smoothing  (default to 'Instant')
     * @param {Number} opts.count  (default to 30)
     * @param {module:api/TimeWarpApi~aPITimeWarpGetTPSAtGetCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/DataPoint>}
     */
    aPITimeWarpGetTPSAtGet(opts, callback) {
      opts = opts || {};
      let postBody = null;

      let pathParams = {
      };
      let queryParams = {
        'Provider': opts['provider'],
        'Network': opts['network'],
        'IncludeSidechains': opts['includeSidechains'],
        'timestamp': opts['timestamp'],
        'smoothing': opts['smoothing'],
        'count': opts['count']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['text/plain', 'application/json', 'text/json'];
      let returnType = [DataPoint];
      return this.apiClient.callApi(
        '/API/TimeWarp/GetTPSAt', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}
