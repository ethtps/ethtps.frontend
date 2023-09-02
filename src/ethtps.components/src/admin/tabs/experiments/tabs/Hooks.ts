
import { useContext, useEffect, useState } from 'react'
import { APIContext } from '../../../../..'
import { APIContext as AdminAPIContext } from '../../../../admin/APIContext'
import { useToast } from '@chakra-ui/react'
import { debounce } from '../../../../../../ethtps.data/src'

export function useExperiments() {
    const api = useAPI()
    return useLoadedObject(() => api.getAllExperimentsAsync())
}

export function useExperiment(id: number) {
    const api = useAPI()
    return useLoadedObject(() => api.getExperimentAsync(id))
}

export function useExperimentTargets() {
    const api = useAPI()
    return useLoadedObject(async () => {
        const experiments = await api.getAllExperimentsAsync()
        let targets = []
        for (const experiment of experiments) {
            targets.push(await api.getExperimentAsync(experiment))
        }
        return targets
    })
}

export function useAPI() {
    return useContext(APIContext)
}

export function useAdminAPI() {
    return useContext(AdminAPIContext)
}

export function useETHTPSAPIs() {
    return { api: useAPI(), adminAPI: useAdminAPI() }
}

export function useLoadedObject<T>(load: () => Promise<T>) {
    const [object, setObject] = useState<T | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const toast = useToast()
    useEffect(() => {
        if (!!error) {
            toast({
                title: 'Request failed',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }, [error, toast])
    useEffect(() => {
        setLoading(true)
        let failureCount = 0
try {
    debounce(() => {
        load().then((result) => {
            setObject(result)
            setLoading(false)
        }).catch((error) => {
            setError(error)
            setLoading(false)
        })
    }, 1000)
        }
        catch (error) {
            setError(error)
            setLoading(false)
            if (++failureCount > 3) {
                return
            }
        }
    }, [load])
    return object
}