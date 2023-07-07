import { Alert, AlertIcon, Box, Button, Link, SimpleGrid, Spacer, Table, TableCaption, Tbody, Text, Thead, Tooltip, Tr } from "@chakra-ui/react"
import { IconExclamationCircle } from "@tabler/icons-react"
import { ETHTPSDataCoreDataType } from "ethtps.api"
import React, { useState } from "react"
import { conditionalRender, DataIssueDialog, SeeMoreButton, useColors } from "../../../.."
import { IProviderTableModel } from "../../../../../ethtps.data/src"
import { AllProvidersHeader } from "./AllProvidersHeader"
import { AllProvidersRows } from "./AllProvidersRows"

export default function AllProvidersTable({
  providerData,
  maxData,
  aggregator,
  instantData,
  dataType,
  showSidechains,
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
                {`L2s ${showSidechains ? "+ sidechains" : ""}`}
              </Text>
            </Box>
            <Box>
              <Tooltip hasArrow title={'Something\'s wrong?'} placement={'top'}>
                <Button onClick={() => setIssueOpen(true)} leftIcon={<IconExclamationCircle />} variant={'ghost'} size={'sm'} colorScheme={'blue'} />
              </Tooltip>
              <DataIssueDialog isOpen={issueOpen} onClose={() => setIssueOpen(false)} />
            </Box>
          </SimpleGrid>
        </TableCaption>
        <Thead >
          <Tr placeContent={'center'}>
            <AllProvidersHeader dataType={dataType ?? ETHTPSDataCoreDataType.TPS} />
          </Tr>
        </Thead>
        <Tbody>
          <AllProvidersRows
            aggregator={aggregator}
            providerData={providerData}
            maxData={maxData}
            dataType={dataType}
            instantData={instantData}
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

        showRowCount > 0 && (providerData?.length as number) > showRowCount)}
      {conditionalRender(
        <Alert status='error'>
          <AlertIcon />
          Error loading data. Try <Link href='/'><Text className={'spaced-horizontally'} color={colors.text}>refreshing</Text></Link> the page.
        </Alert>,
        (providerData?.length ?? 0) === 0)}
    </>
  )
}
