import { useState } from 'react'
import { DataType, TimeInterval } from '../services/api-client/src/models'

export const useNetwork = () => {
  const [network, setNetwork] = useState('Mainnet')
  return { network, setNetwork }
}

export const useExcludeNonGeneralPurposeNetworks = () => {
  const [
    excludeNonGeneralPurposeNetworks,
    setExcludeNonGeneralPurposeNetworks
  ] = useState(false)
  return {
    excludeNonGeneralPurposeNetworks,
    setExcludeNonGeneralPurposeNetworks
  }
}

export const useExcludeSidechains = () => {
  const [excludeSidechains, setExcludeSidechains] = useState(true)
  return {
    excludeSidechains,
    setExcludeSidechains
  }
}


export const useMode = () => {
  const [
    mode,
    setMode
  ] = useState<DataType>(DataType.Tps)
  return {
    mode,
    setMode
  }
}


export const useSmoothing = () => {
  const [smoothing, setSmoothing] = useState(TimeInterval.Instant)
  return {
    smoothing,
    setSmoothing
  }
}
