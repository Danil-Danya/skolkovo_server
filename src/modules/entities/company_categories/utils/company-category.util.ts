import { Prisma } from "@prisma/client";
import { CreateCompanyCategoryDTO, UpdateCompanyCategoryDTO } from "../dto/company_categories.dto";

export const normalizeCompanyCategoryCompanyIds = (
    data: Pick<CreateCompanyCategoryDTO | UpdateCompanyCategoryDTO, "companyIds">
): string[] | undefined => {
    if (data.companyIds === undefined) {
        return undefined;
    }

    return [...new Set(data.companyIds ?? [])];
}

export const replaceCompanyCategoryCompanies = async (
    tx: Prisma.TransactionClient,
    categoryId: string,
    companyIds: string[]
): Promise<void> => {
    await tx.companies.updateMany({
        where: {
            companyCategoryId: categoryId
        },
        data: {
            companyCategoryId: null
        }
    });

    if (!companyIds.length) {
        return;
    }

    await tx.companies.updateMany({
        where: {
            id: {
                in: companyIds
            }
        },
        data: {
            companyCategoryId: categoryId
        }
    });
}
