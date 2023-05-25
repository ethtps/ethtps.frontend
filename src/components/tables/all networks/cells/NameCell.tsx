/* eslint-disable import/no-internal-modules */
import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { Stack, Text, Tooltip } from '@chakra-ui/react'
import React, { forwardRef, useEffect, useState } from 'react'
import { conditionalRender } from '@/services'
import { useGetProviderColorDictionaryFromAppStore } from '@/data'
import Image from 'next/image'
import { IconCloudOff, IconTriangleOff } from '@tabler/icons-react'
import Link from 'next/link'

export function NameCell(config: ICustomCellConfiguration) {
  const colorDictionary = useGetProviderColorDictionaryFromAppStore()
  const name = config.provider?.name ?? ''
  const [color, setColor] = useState(config.provider?.color ?? 'primary')
  useEffect(() => {
    if (colorDictionary) {
      setColor(colorDictionary[name])
    }
  }, [colorDictionary, setColor, name])
  const hasIssues =
    (config.provider?.status?.isUnreliable ?? false) &&
    (config.provider?.status?.isProbablyDown ?? false)
  const noDataProvider = config.provider?.status === undefined
  return (
    <>
      <td
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'Name')
            : () => { }
        }>
        <>
          <Tooltip hasArrow label={<><Text>{`Read more about ${name}`}</Text></>}>
            <>
              <Stack align={'center'}>
                <Stack>
                  <Image
                    alt={`${config.provider?.name} icon`}
                    src={`/provider-icons/${config.provider?.name}.png`}
                    className={'inline'}
                    width={30}
                    height={30}
                    style={{ marginRight: '15px' }}></Image>
                  <Text color={color} className={'boldcell'}>
                    <Link
                      href={`/providers/${config.provider?.name
                        ?.replace(' ', '-')
                        .toLowerCase()}`}>
                      {config.provider?.name}
                    </Link>
                  </Text>
                </Stack>
                {conditionalRender(
                  <>
                    <Tooltip
                      hasArrow
                      placement={'bottom'}
                      label={
                        <>
                          <Text>
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
              </Stack>
            </>
          </Tooltip>
        </>
      </td>
    </>
  )
}
