import { useState } from 'react'
import React from 'react'
import { conditionalRender, getAsync, useColors } from '@/services'
import { AllProvidersHeader, AllProvidersStatusHeader, AllProvidersStatusRows, SeeMoreButton } from '@/components'
import { Alert, AlertIcon, Heading, Table, TableCaption, Tbody, Thead, Tr, Text, Spacer } from '@chakra-ui/react'
import { Link } from '@chakra-ui/next-js'
import { IProviderTableModel } from '@/data'
import { GetServerSideProps } from 'next'
import { ProviderResponseModel } from '@/api-client'

export default function AllProvidersStatusTable({
    providerData,
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
    return (
        <>
            <Table
                aria-label='collapsible table'
                w={'100%'}
                minW={'600px'}
                overflow={'scroll'}
                variant={'unstyled'}>
                <Thead >
                    <Tr placeContent={'center'}>
                        <AllProvidersStatusHeader />
                    </Tr>
                </Thead>
                <Tbody>
                    <AllProvidersStatusRows providerData={providerData} maxRowsBeforeShowingExpand={maxRowsBeforeShowingExpand} />
                </Tbody>
            </Table>
            {conditionalRender(
                <Alert status='error'>
                    <AlertIcon />
                    Error loading data. Try <Link href='/'><Text className={'spaced-horizontally'} color={colors.text}>refreshing</Text></Link> the page.
                </Alert>,
                (providerData?.length ?? 0) === 0)}
        </>
    )
}
