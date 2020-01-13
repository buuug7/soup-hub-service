import { BaseEntity, SelectQueryBuilder } from 'typeorm';

export interface PaginationParam {
  baseUrl?: string;
  perPage?: number;
  currentPage?: number;
  [propName: string]: any;
}

export async function simplePagination(
  selectQueryBuilder: SelectQueryBuilder<BaseEntity>,
  param: PaginationParam,
) {
  let { perPage = 3, currentPage = 1 } = param;
  const { baseUrl = '' } = param;

  const total = await selectQueryBuilder.getCount();

  perPage = Number(perPage);
  currentPage = Number(currentPage);

  if (currentPage <= 0) {
    currentPage = 1;
  }

  if (perPage <= 0) {
    perPage = 1;
  }

  const totalPage =
    total % perPage === 0
      ? total / perPage
      : parseInt(String(total / perPage), 10) + 1;

  let prePage = currentPage - 1;
  let nextPage = currentPage + 1;

  if (totalPage === 0) {
    prePage = null;
    nextPage = null;
  }

  const data = await selectQueryBuilder
    .skip(perPage * (currentPage - 1))
    .take(perPage)
    .getMany();

  return {
    total,
    totalPage,
    perPage,
    currentPage,
    prePageUrl: prePage > 0 ? `${baseUrl}?page=${prePage}` : null,
    nextPageUrl:
      nextPage <= totalPage && nextPage !== null
        ? `${baseUrl}?page=${nextPage}`
        : null,
    data,
  };
}
