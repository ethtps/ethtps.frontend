import React from 'react'
import { Th } from '@chakra-ui/react'
import { useColors } from '@/services'

export interface ITableHeader {
  text: string
  subItems?: ITableHeader[]
}

// Component for rendering a single table header
const SingleTableHeader: React.FC<ITableHeader> = ({ text, subItems }): JSX.Element => {
  const colors = useColors()

  return (
    <Th
      color={colors.text}
      bgColor={colors.gray1}
      _hover={{ color: colors.primary, bgColor: colors.gray2, cursor: 's-resize' }}
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
export const TableHeader: React.FC<{ items: ITableHeader[] }> = ({ items }): JSX.Element => (
  <>
    {items.map((item, index) => (
      <SingleTableHeader key={`${item.text}${index}`} {...item} />
    ))}
  </>
)
