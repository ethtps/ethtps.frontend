import { useDisclosure } from '@chakra-ui/react'
import { IconArrowsVertical, IconChartHistogram, IconChartSankey, TablerIconsProps } from '@tabler/icons-react'
import { useState } from 'react'
import { useQueryStringAndLocalStorageBoundState } from '../../..'

const state1 = {

}

export type NormalizeButtonStateDef = ReturnType<typeof useNormalizeButton>

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
    text: `${isOpen ? 'Turn off normalization' : 'Normalize'}`,
    icon: isOpen ? IconChartSankey : IconChartHistogram,
    offset: (isOpen ? "expand" : "silhouette") as ("expand" | "wiggle" | "none" | "diverging" | "silhouette")
  }
}