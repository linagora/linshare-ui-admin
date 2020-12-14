export default interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  accountType: string;
  canCreateGuest: boolean;
  role: string;
  mail: string;
  locale: string;
  domain: string;
  creationDate: number;
  modificationDate: number;
}
