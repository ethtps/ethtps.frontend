import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { Group, Text, Tooltip } from '@mantine/core'
import { centered } from '../../Cells.Types'
import React, { useEffect, useState } from 'react'
import { conditionalRender } from '@/services'
import { inline, useGetProviderColorDictionaryFromAppStore } from '@/data/src'
import { tableCellTypographyStandard } from './Typography.types'
import Image from 'next/image'
import {
  IconCloud,
  IconCloudOff,
  IconTriangle,
  IconTriangleOff
} from '@tabler/icons-react'

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
    <React.Fragment>
      <td
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'Name')
            : () => {}
        }>
        <>
          <Tooltip withArrow label={<Text>{`Read more about ${name}`}</Text>}>
            <Group align={'center'}>
              <Group>
                <Image
                  alt={`${config.provider?.name} icon`}
                  src={`/provider-icons/${config.provider?.name}.png`}
                  className={'inline'}
                  width={30}
                  height={30}
                  style={{ marginRight: '15px' }}></Image>
                <Text color={color} className={'boldcell'}>
                  {config.provider?.name}
                </Text>
              </Group>
              {conditionalRender(
                <>
                  <Tooltip
                    withArrow
                    position={'bottom'}
                    label={
                      <Text>
                        There are issues getting data for{' '}
                        {config.provider?.name}
                      </Text>
                    }>
                    <IconCloudOff className='inline small centered-vertically' />
                  </Tooltip>
                </>,
                hasIssues && !noDataProvider
              )}
              {conditionalRender(
                <>
                  <Tooltip
                    withArrow
                    position={'bottom'}
                    label={
                      <Text>
                        There is no data provider for {config.provider?.name} :/
                      </Text>
                    }>
                    <IconTriangleOff className='spaced-horizontally' />
                  </Tooltip>
                </>,
                noDataProvider
              )}
            </Group>
          </Tooltip>
        </>
      </td>
    </React.Fragment>
  )
}
