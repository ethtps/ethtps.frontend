export interface Experiment {
    id: number
    projectId: number
    name: string
    description: string
    target: number
    runParameters: number
    apikeyExperimentBindings: ApikeyExperimentBinding[]
    experimentFeedbacks: ExperimentFeedback[]
    experimentResults: ExperimentResult[]
    experimentalSession?: ExperimentalSession
    runParametersNavigation?: ExperimentRunParameter
    targetNavigation?: ExperimentTarget
}

export interface ApikeyExperimentBinding {
    id: number
    experimentId: number
    apikeyId: number
    apikey?: Apikey
    experiment?: Experiment
}

export interface Apikey {
    id: number
    keyHash: string
    totalCalls: number
    callsLast24h: number
    limit24h: number
    requesterIpaddress: string
    apikeyExperimentBindings: ApikeyExperimentBinding[]
    apikeyGroups: ApikeyGroup[]
}

export interface ApikeyGroup {
    id: number
    apikeyId: number
    groupId: number
    apikey?: Apikey
    group?: Group
}

export interface Group {
    id: number
    name: string
    apikeyGroups: ApikeyGroup[]
    groupRoles: GroupRole[]
}

export interface GroupRole {
    id: number
    groupId: number
    roleId: number
    group?: Group
    role?: Role
}

export interface Role {
    id: number
    name: string
    groupRoles: GroupRole[]
    permissionsForRoles: PermissionsForRole[]
}

export interface PermissionsForRole {
    id: number
    roleId: number
    permissionId: number
    permission?: Permission
    role?: Role
}

export interface Permission {
    id: number
    name?: string
    permissionsForRoles: PermissionsForRole[]
}
export interface ExperimentFeedback {
    id: number
    experiment: number
    vote?: boolean
    rating?: number
    text: string
    experimentNavigation?: Experiment
}

export interface ExperimentResult {
    id: number
    experiment: number
    averageRetentionSeconds: number
    sdretentionSeconds: number
    averagePercentageReturnVisitors: number
    sdpercentageReturnVisitors: number
    experimentNavigation?: Experiment
}

export interface ExperimentalSession {
    experiment: number
    targetIpaddress: string
    retentionSeconds: number
    idNavigation?: Experiment
    id: number
}

export interface ExperimentRunParameter {
    id: number
    startDate?: Date
    endDate?: Date
    enabled: boolean
    displayToNpeopleBeforeEnd?: number
    considerFinishedAfterTimeoutSeconds: number
    enrollmentChance?: number
    experiments: Experiment[]
}

export interface ExperimentTarget {
    id: number
    name: string
    description: string
    type: number
    experiments: Experiment[]
    typeNavigation?: ExperimentTargetType
}

export interface ExperimentTargetType {
    id: number
    targetTypeName: string
    targetTypeValue: string
    experimentTargets: ExperimentTarget[]
}
