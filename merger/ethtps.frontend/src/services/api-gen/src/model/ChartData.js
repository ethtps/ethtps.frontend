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

import ApiClient from '../ApiClient';
import DataResponseModel from './DataResponseModel';
import DataType from './DataType';

/**
 * The ChartData model module.
 * @module model/ChartData
 * @version 1.0
 */
class ChartData {
    /**
     * Constructs a new <code>ChartData</code>.
     * @alias module:model/ChartData
     */
    constructor() { 
        
        ChartData.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>ChartData</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/ChartData} obj Optional instance to populate.
     * @return {module:model/ChartData} The populated <code>ChartData</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new ChartData();

            if (data.hasOwnProperty('data')) {
                obj['data'] = ApiClient.convertToType(data['data'], {'String': [DataResponseModel]});
            }
            if (data.hasOwnProperty('dataType')) {
                obj['dataType'] = DataType.constructFromObject(data['dataType']);
            }
        }
        return obj;
    }


}

/**
 * @member {Object.<String, Array.<module:model/DataResponseModel>>} data
 */
ChartData.prototype['data'] = undefined;

/**
 * @member {module:model/DataType} dataType
 */
ChartData.prototype['dataType'] = undefined;






export default ChartData;

