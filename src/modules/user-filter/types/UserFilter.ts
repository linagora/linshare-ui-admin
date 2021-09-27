export default interface UserFilter {
  uuid: string;
  name: string;
  description: string;
  type: USER_FILTER_TYPE;
  creationDate: number;
  modificationDate: number;
  authenticationQuery: string;
  searchUserQuery: string;
  autoCompleteCommandOnAllAttributes: string;
  autoCompleteCommandOnFirstAndLastName: string;
  userMailAttribute: string;
  userFirstNameAttribute: string;
  userLastNameAttribute: string;
  userUidAttribute: string;
  searchPageSize: number;
  searchSizeLimit: number;
  completionPageSize: number;
  completionSizeLimit: number;
}

export enum USER_FILTER_TYPE {
  LDAP = 'LDAP'
}
