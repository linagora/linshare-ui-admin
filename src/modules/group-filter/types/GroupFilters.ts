export interface LDAPGroupFilter {
  uuid: string;
  name: string;
  description?: string;
  type: 'LDAP';
  creationDate?: number;
  modificationDate?: number;
  searchPageSize: number;
  searchAllGroupsQuery: string;
  searchGroupQuery: string;
  groupPrefixToRemove: string;
  groupNameAttribute: string;
  groupMemberAttribute: string;
  memberMailAttribute: string;
  memberFirstNameAttribute: string;
  memberLastNameAttribute: string;
}
