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
import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { DataValueCell, IndexCell, MaxValueCell, NameCell, ProviderTypeCell, TableHeader, range } from '@/components'
import { DataType } from '@/api-client'

export function AllProvidersRows(model: Partial<IProviderTableModel>): JSX.Element {
  const hasData = (model.providerData?.length as number) > 0
  const dataType = model.dataType ?? DataType.Tps
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
