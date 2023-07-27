type Payloader<T = any> = {
  data: T[];
  page: number;
  limit: number;
  totalDocs: number;
  msg?: string;
};

export type ApiResult<T = any> = {
  data: T[];
  message?: string;
  pagination: {
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
};

export function paginator<T = any>(payload: Payloader<T>): ApiResult<T> {
  const { data, page, limit, totalDocs, msg } = payload;
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;

  return {
    data,
    message: msg,
    pagination: {
      totalDocs,
      totalPages,
      page,
      limit,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    },
  };
}
