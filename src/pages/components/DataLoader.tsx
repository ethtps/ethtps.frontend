import { ProviderResponseModel } from "@/api-client"
import { loadProvidersAsync } from "@/data"
import { queryClient } from "@/services"
import { GetStaticProps, InferGetStaticPropsType } from "next"

interface IStaticDependencies {
    providers: ProviderResponseModel[]
}

export const getStaticProps: GetStaticProps<{ model: IStaticDependencies }> = async (context) => {
    const allProviders = await loadProvidersAsync(queryClient)
    console.log("gen", allProviders)
    return {
        props: {
            model: {
                providers: allProviders
            } as IStaticDependencies
        },
        revalidate: 120
    }
}

export default function DataLoader(props: Partial<{ model: IStaticDependencies }>) {
    console.log("inj", props)
    return <></>
}
