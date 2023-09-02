export type ItemWithKeyAndName = {
  key: string
  name: string
  id: string | number | undefined
  [key: string]: any  // allows for other properties
}


export function getColumns<T>(item?: T): ItemWithKeyAndName[] | undefined {
  if (!item) {
    return undefined
  }
  return Object.keys(item).map((key, i) => {
    return {
      key,
      name: key,
      id: `col-${key}-${i}`,
    }
  })
}

export enum DataGridType {
  Providers, Strings, Users, Roles, Permissions, RolesPermissions, UsersRoles, UserPermissions, Environments, Networks, Websites, ProviderLinks, Unknown
}