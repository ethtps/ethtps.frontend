import { useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender } from '@/services'
import { SeeMoreButton } from '@/components'
import { Table } from '@mantine/core'
import { IProviderTableModel } from '@/data'

export default function AllProvidersTable(tableData: IProviderTableModel): JSX.Element {
  const oldShowRowCountValue = tableData.maxRowsBeforeShowingExpand as number
  const [showRowCount, setShowRowCount] = useState(
    tableData?.maxRowsBeforeShowingExpand as number
  )
  const onSeeMore = () => {
    setShowRowCount(tableData.providerData?.length as number)
  }
  const onSeeLess = () => {
    setShowRowCount(oldShowRowCountValue)
  }
  console.log('tableData', tableData)
  return (
    <>
      <Table
        aria-label='collapsible table'
        w={tableData.width}
        verticalSpacing={'md'}>
        <thead>
          <tr>
            <AllProvidersHeader />
          </tr>
        </thead>
        <tbody>
          <AllProvidersRows
            {...tableData}
            maxRowsBeforeShowingExpand={showRowCount}
          />
        </tbody>
      </Table>
      {conditionalRender(
        <SeeMoreButton
          enabled={(tableData.providerData?.length as number) > 0}
          onSeeMore={onSeeMore}
          onSeeLess={onSeeLess}
        />,
        showRowCount > 0
      )}
    </>
  )
}
