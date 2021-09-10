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
};

export enum DOMAIN_TYPE {
  ROOT = 'ROOTDOMAIN',
  TOP = 'TOPDOMAIN',
  SUB = 'SUBDOMAIN',
  GUEST = 'GUESTDOMAIN'
}

export const EMPTY_DOMAIN: Domain = {
  uuid: '',
  name: ''
};
