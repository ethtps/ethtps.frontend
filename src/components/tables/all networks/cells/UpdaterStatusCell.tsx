import { IBasicLiveUpdaterStatus } from "@/api-client"
import { Td } from "@chakra-ui/react"
import { ICustomCellConfiguration } from "."

interface IUpdaterStatusCellProps extends ICustomCellConfiguration {
    status?: IBasicLiveUpdaterStatus
}

export function UpdaterStatusCell() {
    return <>
        <Td>

        </Td>
    </>
}