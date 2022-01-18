export enum DOMAIN_TYPE {
  ROOT = 'ROOTDOMAIN',
  TOP = 'TOPDOMAIN',
  SUB = 'SUBDOMAIN',
  GUEST = 'GUESTDOMAIN'
}

export default interface Domain {
  uuid: string;
  name: string;
  description?: string;
  language?: 'RUSSIAN' | 'ENGLISH' | 'FRENCH';
  creationDate?: number;
  modificationDate?: number;
  defaultEmailLanguage?: string;
  defaultUserRole?: string;
  type?: DOMAIN_TYPE;
  parent?: Partial<Domain>;
  domainPolicy?: {
    name: string;
    uuid: string;
  }
  mailConfiguration?: {
    name: string;
    uuid: string;
  }
  mimePolicy?: {
    name: string;
    uuid: string;
  }
  welcomeMessage?: {
    name: string;
    uuid: string
  }
}

export const EMPTY_DOMAIN: Domain = {
  uuid: '',
  name: ''
};
