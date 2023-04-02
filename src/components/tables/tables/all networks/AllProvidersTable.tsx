import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody
} from '@mui/material'
import { useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender } from '@/services'
import { SeeMoreButton } from '@/components/buttons'
import { IProviderTableModel } from '@/data/src'

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
      <TableContainer component={Paper}>
        <Table
          //size="small"
          sx={{
            minWidth: 750
          }}
          aria-label='collapsible table'>
          <TableHead>
            <AllProvidersHeader />
          </TableHead>
          <TableBody>
            <AllProvidersRows
              {...tableData}
              maxRowsBeforeShowingExpand={showRowCount}
            />
          </TableBody>
        </Table>
      </TableContainer>
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
