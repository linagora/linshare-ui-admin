export interface UpgradeTask {
  identifier: string;
  taskGroup: string;
  parentIdentifier: string;
  taskOrder: number;
  status: string;
  priority: string;
  creationDate: number;
  modificationDate: number;
  asyncTaskUuid: string;
}
export interface ConsoleInfos {
  message: string;
  criticity: string;
  asyncTask: string;
  upgradeTask: string;
  creationDate: number;
}
