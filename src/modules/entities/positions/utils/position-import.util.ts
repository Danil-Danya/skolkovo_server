import { BadRequestException } from "@nestjs/common";
import { extname } from "path";
import type { UploadedStaticFile } from "src/core/types/files.type";
import * as XLSX from "xlsx";
import {
    ParsePositionImportOptions,
    ParsedPositionImportRow,
    PositionImportCreateData,
    PositionImportPlan,
    PositionImportSkippedRow
} from "../types/position-import.type";

const supportedExcelExtensions = new Set([".xls", ".xlsx"]);

export const normalizePositionImportValue = (value: unknown): string => {
    if (typeof value === "string") {
        return value.trim();
    }

    if (value === null || value === undefined) {
        return "";
    }

    return String(value).trim();
}

export const normalizePositionImportName = (value: string): string => {
    return normalizePositionImportValue(value).toLowerCase();
}

export const ensurePositionImportFile = (file?: UploadedStaticFile): UploadedStaticFile => {
    if (!file) {
        throw new BadRequestException("Excel-файл обязателен");
    }

    const fileExtension = extname(file.originalname).toLowerCase();

    if (!supportedExcelExtensions.has(fileExtension)) {
        throw new BadRequestException("Поддерживаются только файлы .xls и .xlsx");
    }

    return file;
}

const readPositionImportWorkbook = (file: UploadedStaticFile): XLSX.WorkBook => {
    try {
        return XLSX.read(file.buffer, {
            type: "buffer"
        });
    }
    catch {
        throw new BadRequestException("Не удалось прочитать Excel-файл");
    }
}

const extractWorksheetRows = (
    sheetName: string,
    worksheet: XLSX.WorkSheet,
    skipFirstRow: boolean
): ParsedPositionImportRow[] => {
    const worksheetRows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: null,
        blankrows: false
    }) as unknown[][];

    const rowsToProcess = skipFirstRow ? worksheetRows.slice(1) : worksheetRows;
    const parsedRows: ParsedPositionImportRow[] = [];

    rowsToProcess.forEach((row, rowIndex) => {
        const hasAnyValues = row.some((cell) => normalizePositionImportValue(cell).length > 0);

        if (!hasAnyValues) {
            return;
        }

        parsedRows.push({
            sheet: sheetName,
            row: rowIndex + (skipFirstRow ? 2 : 1),
            name: normalizePositionImportValue(row[0]),
            description: normalizePositionImportValue(row[1])
        });
    });

    return parsedRows;
}

export const parsePositionImportFile = (
    file: UploadedStaticFile,
    options: ParsePositionImportOptions = {}
): ParsedPositionImportRow[] => {
    const workbook = readPositionImportWorkbook(file);

    if (!workbook.SheetNames.length) {
        throw new BadRequestException("Excel-файл не содержит листов");
    }

    const skipFirstRow = options.skipFirstRow ?? false;
    const parsedRows = workbook.SheetNames.flatMap((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        return extractWorksheetRows(sheetName, worksheet, skipFirstRow);
    });

    if (!parsedRows.length) {
        throw new BadRequestException("Excel-файл не содержит строк с данными");
    }

    return parsedRows;
}

const buildSkippedRow = (
    parsedRow: ParsedPositionImportRow,
    reason: string,
    includeName = true
): PositionImportSkippedRow => {
    return {
        sheet: parsedRow.sheet,
        row: parsedRow.row,
        name: includeName ? parsedRow.name : undefined,
        reason
    };
}

export const buildPositionImportPlan = (
    parsedRows: ParsedPositionImportRow[],
    existingNames: ReadonlySet<string>
): PositionImportPlan => {
    const importedNames = new Set<string>();
    const skippedRows: PositionImportSkippedRow[] = [];
    const positionsToCreate: PositionImportCreateData[] = [];

    for (const parsedRow of parsedRows) {
        if (!parsedRow.name) {
            skippedRows.push(buildSkippedRow(parsedRow, "Название должности обязательно", false));
            continue;
        }

        if (!parsedRow.description) {
            skippedRows.push(buildSkippedRow(parsedRow, "Описание должности обязательно"));
            continue;
        }

        const normalizedName = normalizePositionImportName(parsedRow.name);

        if (existingNames.has(normalizedName)) {
            skippedRows.push(buildSkippedRow(parsedRow, "Должность с таким названием уже существует"));
            continue;
        }

        if (importedNames.has(normalizedName)) {
            skippedRows.push(buildSkippedRow(parsedRow, "Дублирующееся название должности в загруженном файле"));
            continue;
        }

        importedNames.add(normalizedName);
        positionsToCreate.push({
            name: parsedRow.name,
            description: parsedRow.description
        });
    }

    return {
        positionsToCreate,
        skippedRows
    };
}