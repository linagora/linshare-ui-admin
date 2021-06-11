import User from './User';

export default interface UserQuota {
  account: Partial<User>
  creationDate: number,
  defaultMaxFileSize: number,
  defaultQuota: number,
  maintenance: boolean,
  maxFileSize: number,
  modificationDate: number,
  realTimeUsedSpace: number,
  quota: number;
  uuid: string;
  usedSpace: number,
  yersterdayUsedSpace: number,
}