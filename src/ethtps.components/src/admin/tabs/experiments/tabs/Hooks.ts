
import { useContext, useEffect, useState } from 'react'
import { APIContext } from '../../../../..'
import { useToast } from '@chakra-ui/react'

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
    }, [error])
    useEffect(() => {
        setLoading(true)
        try {
            load().then((result) => {
                setObject(result)
                setLoading(false)
            }).catch((error) => {
                setError(error)
                setLoading(false)
            })
        }
        catch (error) {
            setError(error)
            setLoading(false)
        }
    }
        , [])
    return object
}