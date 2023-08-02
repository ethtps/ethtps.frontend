import { useDisclosure } from '@chakra-ui/react'
import { IconArrowsVertical, IconChartHistogram, IconChartSankey, TablerIconsProps } from '@tabler/icons-react'
import { useState } from 'react'
import { useQueryStringAndLocalStorageBoundState } from '../../..'

const state1 = {

}

export const useNormalizeButton = () => {
  const [normalize, setNormalize] = useQueryStringAndLocalStorageBoundState<boolean>(false, "norm")
  const { isOpen, onToggle } = useDisclosure({
    isOpen: normalize,
    onOpen: () => setNormalize(true),
    onClose: () => setNormalize(false)
  })
  return {
    normalize: isOpen,
    toggle: onToggle,
    text: `Turn ${isOpen ? 'off' : 'on'} normalization`,
    icon: isOpen ? IconChartSankey : IconChartHistogram,
    offset: (isOpen ? "expand" : "wiggle") as ("expand" | "wiggle")
  }
}