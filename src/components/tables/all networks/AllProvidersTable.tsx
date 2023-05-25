import { useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender } from '@/services'
import { SeeMoreButton } from '@/components'
import { Heading, Table, TableCaption, Tbody, Thead, Tr } from '@chakra-ui/react'
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
  return (
    <>
      <Table
        aria-label='collapsible table'
        w={'container.lg'}>
        <TableCaption placement={'top'}>
          L2s + sidechains
        </TableCaption>
        <Thead>
          <Tr placeContent={'center'}>
            <AllProvidersHeader />
          </Tr>
        </Thead>
        <Tbody>
          <AllProvidersRows
            {...tableData}
            maxRowsBeforeShowingExpand={showRowCount}
          />
        </Tbody>
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
