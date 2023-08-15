
export type GridColumn = {

}

export type IFormatter<T> = {
    transform: (o?: T, key?: keyof T) => Partial<GridColumn> | undefined
    typeName: string
}