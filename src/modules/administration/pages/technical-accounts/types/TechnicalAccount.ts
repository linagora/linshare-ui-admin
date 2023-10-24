export interface TechnicalAccount {
  name: string;
  role: string;
  mail: string;
  enable: boolean;
  uuid: string;
  modificationDate: number;
  creationDate: number;
  domain: string;
  domainName: string;
}

export interface TechnicalAccountCreation {
  enable: boolean;
  mail: string;
  name: string;
  password: string;
  role: string;
}
