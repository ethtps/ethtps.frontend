import { ETHTPSDataCoreModelsResponseModelsAPIKeyAPIKeyResponseModel } from 'ethtps.api'
import moment from 'moment'
import { useEffect, useState } from 'react'

export const useExistingKeyValidator = (key: string | undefined, apiEndpoint: string) => {
    const [valid, setValid] = useState<boolean>(false)
    const [pending, setPending] = useState<boolean>(false)
    useEffect(() => {
        if (!pending && key && key.length > 0) {
            setPending(true)
            validateKeyAsync(key, apiEndpoint).then((r) => {
                if (r) {
                    localStorage.setItem('apiKey', key)
                }
                setValid(r)
            }).catch(() => {
                setValid(false)
            }).finally(() => {
                setPending(false)
                if (typeof window !== 'undefined') {
                    localStorage.setItem('lastVisitTime', JSON.stringify(moment().format()))
                }
            })
        }
    }, [key])
    return valid
}

const validateKeyAsync = async (key: string, endpoint: string) => {
    return (await fetch(`${endpoint}/api/v3/APIKeys/ValidateKey`).then((res) => { return true }).catch((err) => { return false })).valueOf()
}

export const getKeyAsync = async (endpoint: string, humanityToken: string): Promise<ETHTPSDataCoreModelsResponseModelsAPIKeyAPIKeyResponseModel | null> => {
    return (await fetch(`${endpoint}/api/v3/APIKeys/RegisterNewKeyForProof/GetNewKey?humanityProof=${humanityToken}`, {
        method: 'GET',
    }).then((res) => { return res.json() }).catch((err) => { return null })).valueOf()
}