export default interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  accountType: string;
  canCreateGuest: boolean;
  role: string;
  mail: string;
  externalMailLocale: string;
  domain: {
    label: string;
    identifier: string;
    type: string;
  };
  creationDate: number;
  modificationDate: number;
  secondFAEnabled: boolean;
  secondFARequired: boolean;
}
