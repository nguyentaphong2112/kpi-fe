export interface ApprovalFlow {
    startRecord?: number,
    pageSize?: number,

    approvalFlowId: number,
    name?: string,
    createDate: string,
    createdBy: string,
    lastUpdateDate: string,
    lastUpdatedBy: string,
    listReasons?: ResonLeave[],
    registerLevels?: RegisterLevel[],

    maxDayArray: number[],
    reasonCodeArray:  string[],
    registerLevelIdArray?: string[],
    approvalLevelIdArray?: string[],
    hrLevelCodeArray?: string[],
}

export interface ResonLeave {
    approvalFlowTypeLeavesId?: number,
    approvalFlowId?: number,
    reasonCode?: string,
    maxDay: number,
}

export interface RegisterLevel {
    approvalFlowRegisterId?: number,
    approvalFlowId?: number,
    registerLevelId?: string,
    approvalLevelId?: string,
    hrLevelCode?: string,
}

export interface ObjectCategory {
    label: string,
    value: string
}
