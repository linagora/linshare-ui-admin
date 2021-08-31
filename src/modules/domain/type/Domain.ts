export default interface Domain {
  uuid: string;
  name: string;
  description?: string;
  language?: 'RUSSIAN' | 'ENGLISH' | 'FRENCH';
  creationDate?: number;
  modificationDate?: number;
  defaultEmailLanguage?: string;
  defaultUserRole?: string;
  type?: 'ROOTDOMAIN' | 'TOPDOMAIN' | 'SUBDOMAIN' | 'GUESTDOMAIN';
};

export const EMPTY_DOMAIN: Domain = {
  uuid: '',
  name: ''
};
