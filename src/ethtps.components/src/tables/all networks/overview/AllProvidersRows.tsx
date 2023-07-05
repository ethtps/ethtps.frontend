/* eslint-disable import/no-internal-modules */
import { DataType } from '@/api-client'
import { DataValueCell, IndexCell, MaxValueCell, NameCell, ProviderTypeCell, range } from '@/components'
import {
  DataPointDictionary,
  IProviderTableModel
} from '@/data'
import { Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export function AllProvidersRows(model: Partial<IProviderTableModel>): JSX.Element {
  const hasData = (model.providerData?.length as number) > 0
  const dataType = model.dataType ?? DataType.Tps
  const [initialData, setInitialData] = useState<DataPointDictionary>({})
  useEffect(() => {
    switch (dataType) {
      case DataType.Tps:
        setInitialData(model.instantData?.tpsData ?? {})
        break
      case DataType.Gps:
        setInitialData(model.instantData?.gpsData ?? {})
        break
      default:
        setInitialData(model.instantData?.gtpsData ?? {})
        break
    }
  }, [model.instantData])
  return (
    <>
      {hasData ? (
        <>
          {model.providerData
            ?.slice(
              0,
              Math.min(
                model.providerData?.length,
                model.maxRowsBeforeShowingExpand as number
              )
            )
            ?.map((x, i) => {
              return (
                <Tr key={i} placeContent={'center'}>
                  <IndexCell clickCallback={model.clickCallback} index={i + 1} />
                  <NameCell clickCallback={model.clickCallback} provider={x} />
                  <ProviderTypeCell
                    clickCallback={model.clickCallback}
                    provider={x}
                  />
                  <DataValueCell
                    clickCallback={model.clickCallback}
                    provider={x}
                    initialValue={initialData[x.name ?? '']?.value}
                    dataType={dataType}
                    aggregator={model.aggregator}
                  />
                  <MaxValueCell
                    clickCallback={model.clickCallback}
                    maxData={model.maxData}
                    dataType={dataType}
                    provider={x} />
                </Tr>
              )
            })}
        </>
      ) : (
        renderNoDataRows()
      )}
    </>
  )
}
function renderNoDataRows(): JSX.Element {
  return (
    <>
      {range(3).map((y: number) => {
        return (
          <tr key={y}>
          </tr>
        )
      })}
    </>
  )
}
