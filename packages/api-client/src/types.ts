export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DataResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
