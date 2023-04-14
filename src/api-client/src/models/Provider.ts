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

import { exists, mapValues } from '../runtime'
import type { DataUpdater } from './DataUpdater'
import {
  DataUpdaterFromJSON,
  DataUpdaterFromJSONTyped,
  DataUpdaterToJSON
} from './DataUpdater'
import type { Experiment } from './Experiment'
import {
  ExperimentFromJSON,
  ExperimentFromJSONTyped,
  ExperimentToJSON
} from './Experiment'
import type { OldestLoggedHistoricalEntry } from './OldestLoggedHistoricalEntry'
import {
  OldestLoggedHistoricalEntryFromJSON,
  OldestLoggedHistoricalEntryFromJSONTyped,
  OldestLoggedHistoricalEntryToJSON
} from './OldestLoggedHistoricalEntry'
import type { OldestLoggedTimeWarpBlock } from './OldestLoggedTimeWarpBlock'
import {
  OldestLoggedTimeWarpBlockFromJSON,
  OldestLoggedTimeWarpBlockFromJSONTyped,
  OldestLoggedTimeWarpBlockToJSON
} from './OldestLoggedTimeWarpBlock'
import type { Project } from './Project'
import { ProjectFromJSON, ProjectFromJSONTyped, ProjectToJSON } from './Project'
import type { ProviderDetailsMarkdownPage } from './ProviderDetailsMarkdownPage'
import {
  ProviderDetailsMarkdownPageFromJSON,
  ProviderDetailsMarkdownPageFromJSONTyped,
  ProviderDetailsMarkdownPageToJSON
} from './ProviderDetailsMarkdownPage'
import type { ProviderLink } from './ProviderLink'
import {
  ProviderLinkFromJSON,
  ProviderLinkFromJSONTyped,
  ProviderLinkToJSON
} from './ProviderLink'
import type { ProviderType } from './ProviderType'
import {
  ProviderTypeFromJSON,
  ProviderTypeFromJSONTyped,
  ProviderTypeToJSON
} from './ProviderType'
import type { TimeWarpDataDay } from './TimeWarpDataDay'
import {
  TimeWarpDataDayFromJSON,
  TimeWarpDataDayFromJSONTyped,
  TimeWarpDataDayToJSON
} from './TimeWarpDataDay'
import type { TimeWarpDataHour } from './TimeWarpDataHour'
import {
  TimeWarpDataHourFromJSON,
  TimeWarpDataHourFromJSONTyped,
  TimeWarpDataHourToJSON
} from './TimeWarpDataHour'
import type { TimeWarpDataMinute } from './TimeWarpDataMinute'
import {
  TimeWarpDataMinuteFromJSON,
  TimeWarpDataMinuteFromJSONTyped,
  TimeWarpDataMinuteToJSON
} from './TimeWarpDataMinute'
import type { TimeWarpDataWeek } from './TimeWarpDataWeek'
import {
  TimeWarpDataWeekFromJSON,
  TimeWarpDataWeekFromJSONTyped,
  TimeWarpDataWeekToJSON
} from './TimeWarpDataWeek'
import type { TimeWarpDatum } from './TimeWarpDatum'
import {
  TimeWarpDatumFromJSON,
  TimeWarpDatumFromJSONTyped,
  TimeWarpDatumToJSON
} from './TimeWarpDatum'
import type { TpsandGasDataAll } from './TpsandGasDataAll'
import {
  TpsandGasDataAllFromJSON,
  TpsandGasDataAllFromJSONTyped,
  TpsandGasDataAllToJSON
} from './TpsandGasDataAll'
import type { TpsandGasDataDay } from './TpsandGasDataDay'
import {
  TpsandGasDataDayFromJSON,
  TpsandGasDataDayFromJSONTyped,
  TpsandGasDataDayToJSON
} from './TpsandGasDataDay'
import type { TpsandGasDataHour } from './TpsandGasDataHour'
import {
  TpsandGasDataHourFromJSON,
  TpsandGasDataHourFromJSONTyped,
  TpsandGasDataHourToJSON
} from './TpsandGasDataHour'
import type { TpsandGasDataLatest } from './TpsandGasDataLatest'
import {
  TpsandGasDataLatestFromJSON,
  TpsandGasDataLatestFromJSONTyped,
  TpsandGasDataLatestToJSON
} from './TpsandGasDataLatest'
import type { TpsandGasDataMax } from './TpsandGasDataMax'
import {
  TpsandGasDataMaxFromJSON,
  TpsandGasDataMaxFromJSONTyped,
  TpsandGasDataMaxToJSON
} from './TpsandGasDataMax'
import type { TpsandGasDataMinute } from './TpsandGasDataMinute'
import {
  TpsandGasDataMinuteFromJSON,
  TpsandGasDataMinuteFromJSONTyped,
  TpsandGasDataMinuteToJSON
} from './TpsandGasDataMinute'
import type { TpsandGasDataMonth } from './TpsandGasDataMonth'
import {
  TpsandGasDataMonthFromJSON,
  TpsandGasDataMonthFromJSONTyped,
  TpsandGasDataMonthToJSON
} from './TpsandGasDataMonth'
import type { TpsandGasDataWeek } from './TpsandGasDataWeek'
import {
  TpsandGasDataWeekFromJSON,
  TpsandGasDataWeekFromJSONTyped,
  TpsandGasDataWeekToJSON
} from './TpsandGasDataWeek'
import type { TpsandGasDataYear } from './TpsandGasDataYear'
import {
  TpsandGasDataYearFromJSON,
  TpsandGasDataYearFromJSONTyped,
  TpsandGasDataYearToJSON
} from './TpsandGasDataYear'

/**
 *
 * @export
 * @interface Provider
 */
export interface Provider {
  /**
   *
   * @type {string}
   * @memberof Provider
   */
  name?: string | null
  /**
   *
   * @type {number}
   * @memberof Provider
   */
  type?: number
  /**
   *
   * @type {string}
   * @memberof Provider
   */
  color?: string | null
  /**
   *
   * @type {boolean}
   * @memberof Provider
   */
  isGeneralPurpose?: boolean | null
  /**
   *
   * @type {number}
   * @memberof Provider
   */
  historicalAggregationDeltaBlock?: number | null
  /**
   *
   * @type {boolean}
   * @memberof Provider
   */
  enabled?: boolean
  /**
   *
   * @type {number}
   * @memberof Provider
   */
  subchainOf?: number | null
  /**
   *
   * @type {number}
   * @memberof Provider
   */
  theoreticalMaxTps?: number
  /**
   *
   * @type {Array<DataUpdater>}
   * @memberof Provider
   */
  readonly dataUpdaters?: Array<DataUpdater> | null
  /**
   *
   * @type {Array<Experiment>}
   * @memberof Provider
   */
  readonly experiments?: Array<Experiment> | null
  /**
   *
   * @type {Array<Provider>}
   * @memberof Provider
   */
  readonly inverseSubchainOfNavigation?: Array<Provider> | null
  /**
   *
   * @type {Array<OldestLoggedHistoricalEntry>}
   * @memberof Provider
   */
  readonly oldestLoggedHistoricalEntries?: Array<OldestLoggedHistoricalEntry> | null
  /**
   *
   * @type {Array<OldestLoggedTimeWarpBlock>}
   * @memberof Provider
   */
  readonly oldestLoggedTimeWarpBlocks?: Array<OldestLoggedTimeWarpBlock> | null
  /**
   *
   * @type {Array<Project>}
   * @memberof Provider
   */
  readonly projects?: Array<Project> | null
  /**
   *
   * @type {Array<ProviderDetailsMarkdownPage>}
   * @memberof Provider
   */
  readonly providerDetailsMarkdownPages?: Array<ProviderDetailsMarkdownPage> | null
  /**
   *
   * @type {Array<ProviderLink>}
   * @memberof Provider
   */
  readonly providerLinks?: Array<ProviderLink> | null
  /**
   *
   * @type {Provider}
   * @memberof Provider
   */
  subchainOfNavigation?: Provider
  /**
   *
   * @type {Array<TimeWarpDatum>}
   * @memberof Provider
   */
  readonly timeWarpData?: Array<TimeWarpDatum> | null
  /**
   *
   * @type {Array<TimeWarpDataDay>}
   * @memberof Provider
   */
  readonly timeWarpDataDays?: Array<TimeWarpDataDay> | null
  /**
   *
   * @type {Array<TimeWarpDataHour>}
   * @memberof Provider
   */
  readonly timeWarpDataHours?: Array<TimeWarpDataHour> | null
  /**
   *
   * @type {Array<TimeWarpDataMinute>}
   * @memberof Provider
   */
  readonly timeWarpDataMinutes?: Array<TimeWarpDataMinute> | null
  /**
   *
   * @type {Array<TimeWarpDataWeek>}
   * @memberof Provider
   */
  readonly timeWarpDataWeeks?: Array<TimeWarpDataWeek> | null
  /**
   *
   * @type {Array<TpsandGasDataAll>}
   * @memberof Provider
   */
  readonly tpsandGasDataAlls?: Array<TpsandGasDataAll> | null
  /**
   *
   * @type {Array<TpsandGasDataDay>}
   * @memberof Provider
   */
  readonly tpsandGasDataDays?: Array<TpsandGasDataDay> | null
  /**
   *
   * @type {Array<TpsandGasDataHour>}
   * @memberof Provider
   */
  readonly tpsandGasDataHours?: Array<TpsandGasDataHour> | null
  /**
   *
   * @type {TpsandGasDataLatest}
   * @memberof Provider
   */
  tpsandGasDataLatest?: TpsandGasDataLatest
  /**
   *
   * @type {TpsandGasDataMax}
   * @memberof Provider
   */
  tpsandGasDataMax?: TpsandGasDataMax
  /**
   *
   * @type {Array<TpsandGasDataMinute>}
   * @memberof Provider
   */
  readonly tpsandGasDataMinutes?: Array<TpsandGasDataMinute> | null
  /**
   *
   * @type {Array<TpsandGasDataMonth>}
   * @memberof Provider
   */
  readonly tpsandGasDataMonths?: Array<TpsandGasDataMonth> | null
  /**
   *
   * @type {Array<TpsandGasDataWeek>}
   * @memberof Provider
   */
  readonly tpsandGasDataWeeks?: Array<TpsandGasDataWeek> | null
  /**
   *
   * @type {Array<TpsandGasDataYear>}
   * @memberof Provider
   */
  readonly tpsandGasDataYears?: Array<TpsandGasDataYear> | null
  /**
   *
   * @type {ProviderType}
   * @memberof Provider
   */
  typeNavigation?: ProviderType
  /**
   *
   * @type {number}
   * @memberof Provider
   */
  id?: number
}

/**
 * Check if a given object implements the Provider interface.
 */
export function instanceOfProvider(value: object): boolean {
  let isInstance = true

  return isInstance
}

export function ProviderFromJSON(json: any): Provider {
  return ProviderFromJSONTyped(json, false)
}

export function ProviderFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): Provider {
  if (json === undefined || json === null) {
    return json
  }
  return {
    name: !exists(json, 'name') ? undefined : json['name'],
    type: !exists(json, 'type') ? undefined : json['type'],
    color: !exists(json, 'color') ? undefined : json['color'],
    isGeneralPurpose: !exists(json, 'isGeneralPurpose')
      ? undefined
      : json['isGeneralPurpose'],
    historicalAggregationDeltaBlock: !exists(
      json,
      'historicalAggregationDeltaBlock'
    )
      ? undefined
      : json['historicalAggregationDeltaBlock'],
    enabled: !exists(json, 'enabled') ? undefined : json['enabled'],
    subchainOf: !exists(json, 'subchainOf') ? undefined : json['subchainOf'],
    theoreticalMaxTps: !exists(json, 'theoreticalMaxTps')
      ? undefined
      : json['theoreticalMaxTps'],
    dataUpdaters: !exists(json, 'dataUpdaters')
      ? undefined
      : json['dataUpdaters'] === null
      ? null
      : (json['dataUpdaters'] as Array<any>).map(DataUpdaterFromJSON),
    experiments: !exists(json, 'experiments')
      ? undefined
      : json['experiments'] === null
      ? null
      : (json['experiments'] as Array<any>).map(ExperimentFromJSON),
    inverseSubchainOfNavigation: !exists(json, 'inverseSubchainOfNavigation')
      ? undefined
      : json['inverseSubchainOfNavigation'] === null
      ? null
      : (json['inverseSubchainOfNavigation'] as Array<any>).map(
          ProviderFromJSON
        ),
    oldestLoggedHistoricalEntries: !exists(
      json,
      'oldestLoggedHistoricalEntries'
    )
      ? undefined
      : json['oldestLoggedHistoricalEntries'] === null
      ? null
      : (json['oldestLoggedHistoricalEntries'] as Array<any>).map(
          OldestLoggedHistoricalEntryFromJSON
        ),
    oldestLoggedTimeWarpBlocks: !exists(json, 'oldestLoggedTimeWarpBlocks')
      ? undefined
      : json['oldestLoggedTimeWarpBlocks'] === null
      ? null
      : (json['oldestLoggedTimeWarpBlocks'] as Array<any>).map(
          OldestLoggedTimeWarpBlockFromJSON
        ),
    projects: !exists(json, 'projects')
      ? undefined
      : json['projects'] === null
      ? null
      : (json['projects'] as Array<any>).map(ProjectFromJSON),
    providerDetailsMarkdownPages: !exists(json, 'providerDetailsMarkdownPages')
      ? undefined
      : json['providerDetailsMarkdownPages'] === null
      ? null
      : (json['providerDetailsMarkdownPages'] as Array<any>).map(
          ProviderDetailsMarkdownPageFromJSON
        ),
    providerLinks: !exists(json, 'providerLinks')
      ? undefined
      : json['providerLinks'] === null
      ? null
      : (json['providerLinks'] as Array<any>).map(ProviderLinkFromJSON),
    subchainOfNavigation: !exists(json, 'subchainOfNavigation')
      ? undefined
      : ProviderFromJSON(json['subchainOfNavigation']),
    timeWarpData: !exists(json, 'timeWarpData')
      ? undefined
      : json['timeWarpData'] === null
      ? null
      : (json['timeWarpData'] as Array<any>).map(TimeWarpDatumFromJSON),
    timeWarpDataDays: !exists(json, 'timeWarpDataDays')
      ? undefined
      : json['timeWarpDataDays'] === null
      ? null
      : (json['timeWarpDataDays'] as Array<any>).map(TimeWarpDataDayFromJSON),
    timeWarpDataHours: !exists(json, 'timeWarpDataHours')
      ? undefined
      : json['timeWarpDataHours'] === null
      ? null
      : (json['timeWarpDataHours'] as Array<any>).map(TimeWarpDataHourFromJSON),
    timeWarpDataMinutes: !exists(json, 'timeWarpDataMinutes')
      ? undefined
      : json['timeWarpDataMinutes'] === null
      ? null
      : (json['timeWarpDataMinutes'] as Array<any>).map(
          TimeWarpDataMinuteFromJSON
        ),
    timeWarpDataWeeks: !exists(json, 'timeWarpDataWeeks')
      ? undefined
      : json['timeWarpDataWeeks'] === null
      ? null
      : (json['timeWarpDataWeeks'] as Array<any>).map(TimeWarpDataWeekFromJSON),
    tpsandGasDataAlls: !exists(json, 'tpsandGasDataAlls')
      ? undefined
      : json['tpsandGasDataAlls'] === null
      ? null
      : (json['tpsandGasDataAlls'] as Array<any>).map(TpsandGasDataAllFromJSON),
    tpsandGasDataDays: !exists(json, 'tpsandGasDataDays')
      ? undefined
      : json['tpsandGasDataDays'] === null
      ? null
      : (json['tpsandGasDataDays'] as Array<any>).map(TpsandGasDataDayFromJSON),
    tpsandGasDataHours: !exists(json, 'tpsandGasDataHours')
      ? undefined
      : json['tpsandGasDataHours'] === null
      ? null
      : (json['tpsandGasDataHours'] as Array<any>).map(
          TpsandGasDataHourFromJSON
        ),
    tpsandGasDataLatest: !exists(json, 'tpsandGasDataLatest')
      ? undefined
      : TpsandGasDataLatestFromJSON(json['tpsandGasDataLatest']),
    tpsandGasDataMax: !exists(json, 'tpsandGasDataMax')
      ? undefined
      : TpsandGasDataMaxFromJSON(json['tpsandGasDataMax']),
    tpsandGasDataMinutes: !exists(json, 'tpsandGasDataMinutes')
      ? undefined
      : json['tpsandGasDataMinutes'] === null
      ? null
      : (json['tpsandGasDataMinutes'] as Array<any>).map(
          TpsandGasDataMinuteFromJSON
        ),
    tpsandGasDataMonths: !exists(json, 'tpsandGasDataMonths')
      ? undefined
      : json['tpsandGasDataMonths'] === null
      ? null
      : (json['tpsandGasDataMonths'] as Array<any>).map(
          TpsandGasDataMonthFromJSON
        ),
    tpsandGasDataWeeks: !exists(json, 'tpsandGasDataWeeks')
      ? undefined
      : json['tpsandGasDataWeeks'] === null
      ? null
      : (json['tpsandGasDataWeeks'] as Array<any>).map(
          TpsandGasDataWeekFromJSON
        ),
    tpsandGasDataYears: !exists(json, 'tpsandGasDataYears')
      ? undefined
      : json['tpsandGasDataYears'] === null
      ? null
      : (json['tpsandGasDataYears'] as Array<any>).map(
          TpsandGasDataYearFromJSON
        ),
    typeNavigation: !exists(json, 'typeNavigation')
      ? undefined
      : ProviderTypeFromJSON(json['typeNavigation']),
    id: !exists(json, 'id') ? undefined : json['id']
  }
}

export function ProviderToJSON(value?: Provider | null): any {
  if (value === undefined) {
    return undefined
  }
  if (value === null) {
    return null
  }
  return {
    name: value.name,
    type: value.type,
    color: value.color,
    isGeneralPurpose: value.isGeneralPurpose,
    historicalAggregationDeltaBlock: value.historicalAggregationDeltaBlock,
    enabled: value.enabled,
    subchainOf: value.subchainOf,
    theoreticalMaxTps: value.theoreticalMaxTps,
    subchainOfNavigation: ProviderToJSON(value.subchainOfNavigation),
    tpsandGasDataLatest: TpsandGasDataLatestToJSON(value.tpsandGasDataLatest),
    tpsandGasDataMax: TpsandGasDataMaxToJSON(value.tpsandGasDataMax),
    typeNavigation: ProviderTypeToJSON(value.typeNavigation),
    id: value.id
  }
}