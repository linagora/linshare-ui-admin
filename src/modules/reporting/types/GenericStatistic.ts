export type GenericActions = 'CREATE' | 'UPDATE' | 'DELETE' | 'GET' | 'DOWNLOAD' | 'SUCCESS' | 'FAILURE' | 'PURGE';

export type GenericResourceStatistic = { resource: string } & Record<GenericActions, number>;

export type GenericStatisticByResource = Record<string, Record<GenericActions, number>>;

export interface GenericStatistic {
  uuid?: string;
  value: number;
  domainUuid?: string;
  parentDomainUuid?: string;
  action: GenericActions;
  creationDate: number;
  statisticDate: string;
  resourceType: string;
  type: 'ONESHOT' | 'DAILY';
}
