/* eslint-disable import/no-internal-modules */
import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { HStack, Link, Stack, Td, Text, Tooltip } from '@chakra-ui/react'
import React, { forwardRef, useEffect, useState } from 'react'
import { conditionalRender, useColors } from '@/services'
import { useGetProviderColorDictionaryFromAppStore } from '@/data'
import Image from 'next/image'
import { IconCloudOff, IconTriangleOff } from '@tabler/icons-react'
import { Link as NextLink } from '@chakra-ui/next-js'

export interface INameCellProps extends ICustomCellConfiguration {
}


export function NameCell(config: INameCellProps) {
  const name = config.provider?.name ?? ''
  const colors = useColors()
  const hasIssues =
    (config.provider?.status?.isUnreliable ?? false) &&
    (config.provider?.status?.isProbablyDown ?? false)
  const noDataProvider = config.provider?.status === undefined
  return (
    <>
      <Td
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'Name')
            : () => { }
        }
      >
        <Tooltip hasArrow label={<><Text color={colors.text}>{`Read more about ${name}`}</Text></>}>
          <>
            <HStack align={'center'}>
              <HStack >
                <Image
                  alt={`${config.provider?.name} icon`}
                  src={`/provider-icons/${config.provider?.name}.png`}
                  className={'inline'}
                  width={30}
                  height={30}
                  style={{ marginRight: '15px' }}></Image>
                <Link
                  as={NextLink}
                  color={'red'}
                  className={'boldcell'}
                  href={`/providers/${config.provider?.name
                    ?.replace(' ', '%20')}`}>
                  <Text color={colors.text}>
                    {config.provider?.name}
                  </Text>
                </Link>
              </HStack>
              {conditionalRender(
                <>
                  <Tooltip
                    hasArrow
                    placement={'bottom'}
                    label={
                      <>
                        <Text color={colors.text}>
                          There are issues getting data for{' '}
                          {config.provider?.name}
                        </Text>
                      </>
                    }>
                    <>
                      <IconCloudOff className='inline small centered-vertically' />
                    </>
                  </Tooltip>
                </>,
                hasIssues && !noDataProvider
              )}
              {conditionalRender(
                <>
                  <Tooltip
                    hasArrow
                    placement={'bottom'}
                    label={
                      <>
                        <Text>
                          There is no data provider for {config.provider?.name} :/
                        </Text>
                      </>
                    }>
                    <>
                      <IconTriangleOff className='spaced-horizontally' />
                    </>
                  </Tooltip>
                </>,
                noDataProvider
              )}
            </HStack>
          </>
        </Tooltip>
      </Td>
    </>
  )
}
