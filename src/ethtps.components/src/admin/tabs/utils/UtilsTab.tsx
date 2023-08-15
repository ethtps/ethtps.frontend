
import { useContext } from "react"
import { APIContext } from "../../../.."
import { SimpleAPIActionButton } from "../../buttons/SimpleAPIActionButton"
import { InsertGenerator } from "./InsertGenerator"

export function UtilsTab() {
    const api = useContext(APIContext)
    return <>
        <SimpleAPIActionButton
            title={'Enable all data providers'}
            description={'Enables all automatically disabled data providers'}
            buttonIcon={<></>}
            buttonColor={'green'}
            actionSeverity="info"
            pendingMessage={'Enabling data providers...'}
            buttonMessage="Run"
            action={() => api.enableAllDataUpdatersAsync()}
            generateSuccessMessage={() => `Enabled all providers`} />

        <SimpleAPIActionButton
            title={'Clear job queue'}
            description={'Deletes all Hangfire job queue entries from the database'}
            buttonIcon={<></>}
            buttonColor={'red'}
            actionSeverity="warning"
            buttonMessage="Clear"
            pendingMessage={'Clearing job queue...'}
            action={() => api.clearHangfireQueueAsync()}
            generateSuccessMessage={() => `Cleared queue`} />

        <InsertGenerator />
    </>
}