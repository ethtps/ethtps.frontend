/* eslint-disable import/no-internal-modules */
import {
  IProviderTableModel,
  getModeData,
  extractData,
  useGetLiveDataFromAppStore,
  useGetLiveDataModeFromAppStore,
  getMaxDataFor
} from '@/data'
import React from 'react'
import { useEffect, useState } from 'react'
import { Tr } from '@chakra-ui/react'
import { DataValueCell, IndexCell, MaxValueCell, NameCell, ProviderTypeCell, range } from '@/components'
import { DataType } from '@/api-client'

export function AllProvidersRows(model: IProviderTableModel): JSX.Element {
  const hasData = (model.providerData?.length as number) > 0
  const mode = useGetLiveDataModeFromAppStore()
  const liveData = useGetLiveDataFromAppStore()
  const [data, setData] = useState(getModeData(liveData ?? {}, mode))
  useEffect(() => {
    setData(getModeData(liveData ?? {}, mode))
  }, [mode, liveData])
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
              const maxTPS = getMaxDataFor(model.maxData, x.name, DataType.Tps)
              const maxGPS = getMaxDataFor(model.maxData, x.name, DataType.Gps)
              const maxGTPS = getMaxDataFor(model.maxData, x.name, DataType.GasAdjustedTps)
              return (
                <Tr key={i} placeContent={'center'}>
                  <IndexCell clickCallback={model.clickCallback} index={i + 1} />
                  <NameCell clickCallback={model.clickCallback} provider={x} />
                  <DataValueCell
                    clickCallback={model.clickCallback}
                    provider={x}
                    dataType={mode}
                    value={extractData(data, x.name)}
                  />
                  <MaxValueCell
                    clickCallback={model.clickCallback}
                    tps={maxTPS}
                    gps={maxGPS}
                    gtps={maxGTPS}
                    provider={x}
                  />
                  <ProviderTypeCell
                    clickCallback={model.clickCallback}
                    provider={x}
                  />
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
