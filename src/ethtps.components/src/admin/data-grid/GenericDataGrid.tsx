
import { Heading, Progress } from "@chakra-ui/react"
import { ETHTPSDataIntegrationsMSSQLProvider } from "ethtps.api"
import { useEffect, useMemo, useState } from "react"
import DataGrid from 'react-data-grid'
import { DataGridFormatter, DataGridType, EmptyFormatter, getFormatter } from "../"
import { conditionalRender } from "../../.."

interface DataGridProps<T> {
  data?: T[] | (()=>Promise<T[]>),
  dataType: DataGridType,
  onAddOrUpdate?: (data: T) => void
}

/**
 * A data grid that is made to edit almost anything from the database. The generic argument T is REQUIRED, otherwise the grid will not work.
 **/
export function GenericDataGrid<T extends Partial<{ id: number | string }>>(props: DataGridProps<T>, dataType: DataGridType) {
    const [formatter, setFormatter] = useState<DataGridFormatter<T>>()
  const [data, setData] = useState<T[] | undefined>(() => {
      if (Array.isArray(props.data)) {
          setFormatter(getFormatter<T>(props.dataType) ?? EmptyFormatter<T>())
          return props.data
      }
  })
    useEffect(() => {
        if (!Array.isArray(props.data)) {
            props.data?.().then((data) => {
                setFormatter(getFormatter<T>(props.dataType) ?? EmptyFormatter<T>())
                return data
            })
        }
    }, [ props, props.data ])
  return (!!data && !!formatter && !!data[0]) ? <>
      <DataGrid
          style={{
              height: '100%',
              maxHeight: '80vh',
              textAlign: 'left'
          }}
      columns={formatter?.columns?.(data[0])}
      rows={data}
      rowClass={(r, i) => r?.id === 0 ? 'rdg-header' : undefined}
      defaultColumnOptions={{
        resizable: true
      }} />
  </> : <>
          <Progress isIndeterminate />
          <Heading size="md">Loading...</Heading>
  </>
}