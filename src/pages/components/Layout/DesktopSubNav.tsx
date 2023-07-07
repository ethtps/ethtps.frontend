import { ChevronRightIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  Icon,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text
} from '@chakra-ui/react'
import { useColors } from '../../../ethtps.components'
import { NavItem } from './Types'
export const DesktopSubNav = ({ label, href, subLabel, children }: NavItem) => {
  const colors = useColors()
  return (
    <Popover trigger='hover' placement='right-start'>
      <PopoverTrigger>
        <Link
          href={href}
          role={'group'}
          display={'block'}
          p={2}
          rounded={'md'}
          _hover={{ bg: colors.gray1 }}>
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                color={colors.text}
                transition={'all .3s ease'}
                fontWeight={500}>
                {label}
              </Text>
              <Text color={colors.text} fontSize={'sm'}>
                {subLabel}
              </Text>
            </Box>
            <Flex
              transition={'all .3s ease'}
              transform={'translateX(-10px)'}
              opacity={0}
              _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
              justify={'flex-end'}
              align={'center'}
              flex={1}>
              <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
          </Stack>
        </Link>
      </PopoverTrigger>
      {children && (
        <PopoverContent
          border={0}
          boxShadow={'xl'}
          bg={colors.background}
          p={4}
          rounded={'md'}
          maxW={'sm'}
          w={'max-content'}>
          <Stack>
            {children.map((child, index) => (
              <DesktopSubNav key={index} {...child} />
            ))}
          </Stack>
        </PopoverContent>
      )}
    </Popover>
  )
}
