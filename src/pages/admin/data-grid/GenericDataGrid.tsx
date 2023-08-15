import { Progress } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import DataGrid from 'react-data-grid'

interface DataGridProps<T> {
  data: T[] | Promise<T[]>
}

export function GenericDataGrid<T>(props: DataGridProps<T>, dataTypeName: string) {
  const [data, setData] = useState<T[] | undefined>(() => {
    if (Array.isArray(props.data)) {
      return props.data
    } else props.data.then(setData)
  })
  const [columns, setColumns] = useState<string[]>()
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0 && !!data?.[0]) {
      setColumns(Object.keys(data[0] as any))
    }
  }, [])
  return (!!data && !!columns) ? <>

  </> : <>
    <Progress isIndeterminate />
  </>
}