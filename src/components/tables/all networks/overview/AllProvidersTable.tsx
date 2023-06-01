import { useEffect, useState } from 'react'
import { AllProvidersHeader } from './AllProvidersHeader'
import { AllProvidersRows } from './AllProvidersRows'
import React from 'react'
import { conditionalRender, getAsync, useColors } from '@/services'
import { DataIssueDialog, SeeMoreButton } from '@/components'
import { Alert, AlertIcon, Heading, Link, Table, TableCaption, Tbody, Thead, Tr, Text, HStack, Box, Flex, Spacer, Button, Stack, SimpleGrid, Tooltip } from '@chakra-ui/react'
import { IProviderTableModel } from '@/data'
import { GetServerSideProps } from 'next'
import { ProviderResponseModel } from '@/api-client'
import { IconExclamationCircle } from '@tabler/icons-react'

export default function AllProvidersTable({
  providerData,
  maxData,
  aggregator,
  dataType,
  maxRowsBeforeShowingExpand = 25
}: Partial<IProviderTableModel>): JSX.Element {
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
  const [issueOpen, setIssueOpen] = React.useState(false)
  return (
    <>
      <Table
        aria-label='collapsible table'
        overflow={'scroll'}
        variant={'unstyled'}>
        <TableCaption placement={'top'}>
          <SimpleGrid columns={3}>
            <Spacer />
            <Box>
              <Text color={colors.text} fontSize={'sm'}>
                L2s + sidechains
              </Text>
            </Box>
            <Box>
              <Tooltip hasArrow label={'Something\'s wrong?'} placement={'top'}>
                <Button onClick={() => setIssueOpen(true)} leftIcon={<IconExclamationCircle />} variant={'ghost'} size={'sm'} colorScheme={'blue'} />
              </Tooltip>
              <DataIssueDialog isOpen={issueOpen} onClose={() => setIssueOpen(false)} />
            </Box>
          </SimpleGrid>
        </TableCaption>
        <Thead >
          <Tr placeContent={'center'}>
            <AllProvidersHeader />
          </Tr>
        </Thead>
        <Tbody>
          <AllProvidersRows
            aggregator={aggregator}
            providerData={providerData}
            maxData={maxData}
            dataType={dataType}
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
