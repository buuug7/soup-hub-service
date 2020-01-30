import { BaseEntity, SelectQueryBuilder } from 'typeorm';

export interface PaginationParam {
  perPage?: number;
  currentPage?: number;
  [propName: string]: any;
}

export async function simplePagination(
  selectQueryBuilder: SelectQueryBuilder<BaseEntity>,
  param: PaginationParam,
) {
  let { perPage = 10, currentPage = 1 } = param;

  perPage = parseInt(String(perPage), 10);
  currentPage = parseInt(String(currentPage), 10);

  const total = await selectQueryBuilder.getCount();

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

  const data = await selectQueryBuilder
    .skip(perPage * (currentPage - 1))
    .take(perPage)
    .getMany();

  return {
    total,
    totalPage,
    perPage,
    currentPage,
    data,
  };
}
