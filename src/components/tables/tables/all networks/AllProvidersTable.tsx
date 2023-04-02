import { useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender } from '@/services'
import { SeeMoreButton } from '@/components/buttons'
import { IProviderTableModel } from '@/data/src'
import { Container } from '@mui/system'
import { Table } from '@mantine/core'

export function AllProvidersTable(tableData: IProviderTableModel): JSX.Element {
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
  return (
    <React.Fragment>
      <Table
        //size="small"
        sx={{
          minWidth: 750
        }}
        aria-label='collapsible table'>
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
    </React.Fragment>
  )
}
