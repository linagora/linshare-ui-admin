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
export interface AsyncTask {
  uuid: string;
  status: string;
  errorMsg: string;
  errorName: string;
  errorCode: string;
  frequency: string;
  fileName: string;
  resourceUuid: string;
  creationDate: number;
  modificationDate: number;
  transfertDuration: number;
  waitingDuration: number;
  processingDuration: number;
}
