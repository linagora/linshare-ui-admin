export interface PaginatedList<T> {
  data: T[];
  total: number;
  current: number;
}
