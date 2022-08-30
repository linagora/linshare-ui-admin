export interface PaginatedList<T> {
  data: T[];
  total: number;
  totalPages: number;
  current: number;
}
