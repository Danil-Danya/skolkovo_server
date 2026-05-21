export type ParsePositionImportOptions = {
    skipFirstRow?: boolean;
};

export type ParsedPositionImportRow = {
    description: string;
    name: string;
    row: number;
    sheet: string;
};

export type PositionImportCreateData = {
    description: string;
    name: string;
};

export type PositionImportSkippedRow = {
    name?: string;
    reason: string;
    row: number;
    sheet: string;
};

export type PositionImportPlan = {
    positionsToCreate: PositionImportCreateData[];
    skippedRows: PositionImportSkippedRow[];
};
