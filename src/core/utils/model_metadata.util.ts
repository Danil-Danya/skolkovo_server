export async function findAndPaginate(model: any, params: {
    where?: Record<string, any>;
    orderBy?: Record<string, any> | Array<Record<string, any>>;
    select?: Record<string, any>;
    include?: Record<string, any>;
    page?: number;
    limit?: number;
}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const skip = (page - 1) * limit;

    const queryOptions: Record<string, any> = {
        where: params.where,
        orderBy: params.orderBy,
        take: limit,
        skip
    };

    if (params.select) {
        queryOptions.select = params.select;
    }
    else if (params.include) {
        queryOptions.include = params.include;
    }

    const [items, totalItems] = await Promise.all([
        model.findMany(queryOptions),
        model.count({
            where: params.where
        })
    ]);

    return {
        meta: {
            page,
            limit,
            totalItems,
            totalPages: Math.ceil(totalItems / limit)
        },
        items
    };
}