import React from 'react'
import { Th } from '@chakra-ui/react'
import { useColors } from '@/services'
import { ProviderResponseModel } from '@/api-client'

export function toProviderResponseModelKey(key: string): keyof ProviderResponseModel {
  const model: ProviderResponseModel = {
    name: null,
    color: null,
    theoreticalMaxTPS: undefined,
    type: null,
    isGeneralPurpose: undefined,
    isSubchainOf: null,
    status: undefined
  }

  if (key in model) {
    return key as keyof ProviderResponseModel
  } else {
    return 'status'
  }
}

export interface ITableHeader {
  text: string
  subItems?: ITableHeader[]
  columnClicked?: (column: keyof ProviderResponseModel) => void
}

// Component for rendering a single table header
const SingleTableHeader: React.FC<ITableHeader> = ({ text, subItems, columnClicked }): JSX.Element => {
  const colors = useColors()

  return (
    <Th
      color={colors.text}
      bgColor={colors.gray1}
      _hover={{ color: colors.primary, bgColor: colors.gray2, cursor: 's-resize' }}
      onClick={() => columnClicked?.(toProviderResponseModelKey(text))}
      fontSize={'1rem'}
      height={50}
    >
      {text}
      {/*subItems && subItems.map((subItem, index) => (
        <SingleTableHeader key={`${subItem.text}${index}`} {...subItem} />
      ))*/}
    </Th>
  )
}

// Component for rendering multiple table headers
export function TableHeader({ items, columnClicked }: {
  items: ITableHeader[],
  columnClicked?: (column: keyof ProviderResponseModel) => void
}) {
  return <>
    {items.map((item, index) => (
      <SingleTableHeader columnClicked={columnClicked} key={`${item.text}${index}`} {...item} />
    ))}
  </>
}
