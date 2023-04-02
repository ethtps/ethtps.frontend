import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { Text, Tooltip } from '@mantine/core'
import { centered } from '../../Cells.Types'
import React, { useEffect, useState } from 'react'
import { conditionalRender } from '@/services'
import { useGetProviderColorDictionaryFromAppStore } from '@/data/src'
import { tableCellTypographyStandard } from './Typography.types'
import Image from 'next/image'
import { IconCloud, IconTriangle } from '@tabler/icons-react'

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
      <Tooltip
        withArrow
        label={<Text>{`Click to read more about ${name}`}</Text>}>
        <td
          {...buildClassNames(config)}
          onClick={() =>
            config.clickCallback !== undefined
              ? config.clickCallback(config.provider, 'Name')
              : () => {}
          }>
          <>
            <div className={'box'}>
              <div>
                <Image
                  alt={`${config.provider?.name} icon`}
                  src={`provider-icons/${config.provider?.name}.png`}
                  className={'tiny-img inline'}
                  style={{ marginRight: '15px' }}></Image>
                <Text
                  className={`inline ${
                    config.clickCallback !== undefined ? 'pointable' : ''
                  }`}
                  color={color}
                  {...tableCellTypographyStandard}>
                  {config.provider?.name}
                </Text>
              </div>
              {conditionalRender(
                <>
                  <Tooltip
                    withArrow
                    className='spaced-horizontally'
                    label={
                      <Text>
                        There are issues getting data for{' '}
                        {config.provider?.name}
                      </Text>
                    }>
                    <IconCloud className='inline small centered-vertically' />
                  </Tooltip>
                </>,
                hasIssues && !noDataProvider
              )}
              {conditionalRender(
                <>
                  <Tooltip
                    withArrow
                    label={
                      <Text>
                        There is no data provider for {config.provider?.name} :/
                      </Text>
                    }>
                    <IconTriangle className='spaced-horizontally' />
                  </Tooltip>
                </>,
                noDataProvider
              )}
            </div>
          </>
        </td>
      </Tooltip>
    </React.Fragment>
  )
}
