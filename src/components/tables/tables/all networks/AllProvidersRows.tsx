import { SkeletonWithTooltip } from '@/components'
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
import {
  IndexCell,
  NameCell,
  DataValueCell,
  MaxValueCell,
  ProviderTypeCell
} from './cells'

export function AllProvidersRows(model: IProviderTableModel): JSX.Element {
  const hasData = (model.providerData?.length as number) > 0
  const mode = useGetLiveDataModeFromAppStore()
  const liveData = useGetLiveDataFromAppStore()
  const [data, setData] = useState(getModeData(liveData ?? {}, mode))
  useEffect(() => {
    setData(getModeData(liveData ?? {}, mode))
  }, [mode, liveData])
  return (
    <React.Fragment>
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
            ?.map((x, i) => (
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
            ))}
        </>
      ) : (
        range(0, 2 + 1).map((y: number) => {
          return (
            <tr key={y}>
              {range(0, 5).map((x: number) => (
                <td key={x}>
                  <SkeletonWithTooltip randomDelay rectangular={false} />
                </td>
              ))}
            </tr>
          )
        })
      )}
    </React.Fragment>
  )
}
