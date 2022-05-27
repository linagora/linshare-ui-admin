export enum SORT_ORDER {
  ASC = 'ASC',
  DESC = 'DESC',
}

export default interface Sort {
  field?: string;
  order: SORT_ORDER;
}
