export interface DataType {
    data: {
        id: string;
        firstname: string;
        lastname: string;
        streakCount: number;
    },
    meta: {
        pagination: {
            count: number;
            pageCount: number;
            pageNumber: number;
            pageSize: number
        },
        data: {
            mau: number;
            mrr: number;
            referralCount: number;
        }
    }

}

export interface ParamsType {
    limit: number,
    page: number,
    search: string,
}