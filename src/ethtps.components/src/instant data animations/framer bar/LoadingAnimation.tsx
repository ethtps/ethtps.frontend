
import { Center } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { IComponentSize } from '../../..'


export function LoadingAnimation(props: IComponentSize) {
  return (
    <>
      <Center>
        <motion.div
          className={'loading-box'}
          animate={{
            scale: [1, 1.1, 1.1, 1, 1],
            rotate: [0, 0, 180, 180, 0],
            borderRadius: ['0%', '0%', '50%', '50%', '0%']
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            times: [0, 0.2, 0.5, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      </Center>
    </>
  )
}