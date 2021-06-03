export default interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  accountType: string;
  canUpload: boolean;
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
  expirationDate: number;
  secondFAEnabled: boolean;
  secondFARequired: boolean;
}
