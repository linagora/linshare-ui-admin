export type StorageConsumptionStatisticByDate = Record<
  string,
  {
    countOfAddedFiles: number;
    countOfDeletedFiles: number;
    countOfFiles: number;
    sumOfAddedFiles: number;
    sumOfDeletedFiles: number;
    diffOperationSum: number;
    actualOperationSum: number;
  }
>;

export type StorageConsumtptionStatisticType =
  | 'USER_DAILY_STAT'
  | 'USER_WEEKLY_STAT'
  | 'USER_MONTHLY_STAT'
  | 'WORK_GROUP_DAILY_STAT'
  | 'WORK_GROUP_WEEKLY_STAT'
  | 'WORK_GROUP_MONTHLY_STAT'
  | 'DOMAIN_DAILY_STAT'
  | 'DOMAIN_WEEKLY_STAT'
  | 'DOMAIN_MONTHLY_STAT';

export interface StorageConsumptionStatistic {
  creationDate: number;
  statisticDate: number;
  domain: {
    uuid: string;
    name: string;
  };
  statisticType: StorageConsumtptionStatisticType;
  countOfAddedFiles: number;
  countOfDeletedFiles: number;
  countOfFiles: number;
  sumOfAddedFiles: number;
  sumOfDeletedFiles: number;
  diffOperationSum: number;
  actualOperationSum: number;
  account: {
    uuid: string;
    name: string;
  };
}
