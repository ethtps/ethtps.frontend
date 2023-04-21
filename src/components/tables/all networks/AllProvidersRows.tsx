/* eslint-disable import/no-internal-modules */
import {
  IProviderTableModel,
  getModeData,
  extractData,
  useGetLiveDataFromAppStore,
  useGetLiveDataModeFromAppStore
} from '@/data'
import { range } from 'd3-array'
import React from 'react'
import { useEffect, useState } from 'react'
import { DataValueCell } from './cells/DataValueCell'
import { IndexCell } from './cells/IndexCell'
import { MaxValueCell } from './cells/MaxValueCell'
import { NameCell } from './cells/NameCell'
import { ProviderTypeCell } from './cells/ProviderTypeCell'

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
              console.log("AllProvidersRows", x, i)
              return (
                <tr key={i}>
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
                    provider={x}
                  />
                  <ProviderTypeCell
                    clickCallback={model.clickCallback}
                    provider={x}
                  />
                </tr>
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
      {range(0, 2 + 1).map((y: number) => {
        return (
          <tr key={y}>
          </tr>
        )
      })}
    </>
  )
}
