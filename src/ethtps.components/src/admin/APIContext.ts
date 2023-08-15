import { createContext } from 'react'
import { AdminAPIWrapper } from '../../../ethtps.data/src'

export const APIContext = createContext<AdminAPIWrapper>(AdminAPIWrapper.DEFAULT)