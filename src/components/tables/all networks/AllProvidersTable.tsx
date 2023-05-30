import { useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender, getAsync, useColors } from '@/services'
import { SeeMoreButton } from '@/components'
import { Alert, AlertIcon, Heading, Link, Table, TableCaption, Tbody, Thead, Tr, Text } from '@chakra-ui/react'
import { IProviderTableModel } from '@/data'
import { GetServerSideProps } from 'next'
import { ProviderResponseModel } from '@/api-client'

export default function AllProvidersTable({
  providerData,
  maxRowsBeforeShowingExpand = 25
}: IProviderTableModel): JSX.Element {
  const oldShowRowCountValue = maxRowsBeforeShowingExpand as number
  const [showRowCount, setShowRowCount] = useState(
    maxRowsBeforeShowingExpand
  )
  const onSeeMore = () => {
    setShowRowCount(providerData?.length as number)
  }
  const onSeeLess = () => {
    setShowRowCount(oldShowRowCountValue)
  }
  const colors = useColors()
  return (
    <>
      <Table
        aria-label='collapsible table'
        w={'container.lg'}
        variant={'unstyled'}>
        <TableCaption placement={'top'}>
          L2s + sidechains
        </TableCaption>
        <Thead >
          <Tr placeContent={'center'}>
            <AllProvidersHeader />
          </Tr>
        </Thead>
        <Tbody>
          <AllProvidersRows
            providerData={providerData}
            maxRowsBeforeShowingExpand={showRowCount}
          />
        </Tbody>
      </Table>
      {conditionalRender(
        <SeeMoreButton
          enabled={(providerData?.length as number) > 0}
          onSeeMore={onSeeMore}
          onSeeLess={onSeeLess}
        />,

        showRowCount > 0)}
      {conditionalRender(
        <Alert status='error'>
          <AlertIcon />
          Error loading data. Try <Link href='/'><Text className={'spaced-horizontally'} color={colors.text}>refreshing</Text></Link> the page.
        </Alert>,
        (providerData?.length ?? 0) === 0)}
    </>
  )
}
