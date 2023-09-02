import { Column } from "react-data-grid"
import { DataGridType, ItemWithKeyAndName, getColumns } from './DataGridUtils'
import { ETHTPSDataIntegrationsMSSQLExternalWebsite, ETHTPSDataIntegrationsMSSQLProvider, ETHTPSDataIntegrationsMSSQLProviderLink } from "ethtps.api"
import { ETHTPSConfigurationDatabaseEnvironment } from "ethtps.admin.api"

export interface DataGridFormatter<T> {
  columns: (instance: T) => (T & ItemWithKeyAndName)[]
  dataType: DataGridType
}

export function EmptyFormatter<T>(): DataGridFormatter<T> {
  return {
    columns: (instance: T) => [{ key: 'Unknown key', name: 'Unknown data type', id: 'NaN' } as T & ItemWithKeyAndName],
    dataType: DataGridType.Unknown
  }
}

function providerSorter(a: any, b: any): number {
  const customOrder = ['id', 'name', 'color', 'type', 'theoreticalMaxTps']
  const aIndex = customOrder.indexOf(a.key)
  const bIndex = customOrder.indexOf(b.key)
  if (aIndex > -1 && bIndex > -1) {
    return aIndex - bIndex
  }
  if (aIndex > -1) {
    return -1
  }
  if (bIndex > -1) {
    return 1
  }
  return a.key.localeCompare(b.key)
}

const providerFormatter = {
  dataType: DataGridType.Providers,
  columns: (instance: ETHTPSDataIntegrationsMSSQLProvider) => getColumns(instance)?.sort(providerSorter)
} as DataGridFormatter<ETHTPSDataIntegrationsMSSQLProvider>

const stringFormatter = {
    dataType: DataGridType.Strings,
    columns: (instance: string) => getColumns(instance)
} as DataGridFormatter<string>

const environmentFormatter = {
    dataType: DataGridType.Environments,
    columns: (instance: ETHTPSConfigurationDatabaseEnvironment) => getColumns(instance),
} as DataGridFormatter<ETHTPSConfigurationDatabaseEnvironment>

const networkFormatter = {
    dataType: DataGridType.Networks,
    columns: (instance: ETHTPSConfigurationDatabaseEnvironment) => getColumns(instance),
} as DataGridFormatter<ETHTPSConfigurationDatabaseEnvironment>

const providerLinksFormatter = {
    dataType: DataGridType.ProviderLinks,
    columns: (instance: ETHTPSDataIntegrationsMSSQLProviderLink) => getColumns(instance)?.sort(providerSorter)
} as DataGridFormatter<ETHTPSDataIntegrationsMSSQLProviderLink>

const externalWebsitesFormatter = {
    dataType: DataGridType.Websites,
    columns: (instance: ETHTPSDataIntegrationsMSSQLExternalWebsite) => getColumns(instance)?.sort(providerSorter)
} as DataGridFormatter<ETHTPSDataIntegrationsMSSQLExternalWebsite>

export function getFormatter<T>(type: DataGridType): DataGridFormatter<T> | undefined {
  switch (type) {
    case DataGridType.Providers:
          return providerFormatter as unknown as DataGridFormatter<T>
      case DataGridType.Strings:
         return stringFormatter as unknown as DataGridFormatter<T>
      case DataGridType.Environments:
         return environmentFormatter as unknown as DataGridFormatter<T>
      case DataGridType.Networks:
         return networkFormatter as unknown as DataGridFormatter<T>
      case DataGridType.ProviderLinks:
          return providerLinksFormatter as unknown as DataGridFormatter<T>
      case DataGridType.Websites:
return externalWebsitesFormatter as unknown as DataGridFormatter<T>
      default:
          return EmptyFormatter<T>()
  }
}
