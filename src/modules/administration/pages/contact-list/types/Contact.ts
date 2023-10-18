import Domain from '@/core/types/Domain';
import User from '@/modules/user/types/User';
import Filters from '@/core/types/Filters';
import { SORT_ORDER } from '@/core/types/Sort';

export interface Contact {
  identifier: string;
  description: string;
  owner: User;
  contacts: ContactInfo[];
  uuid: string;
  domainId: string;
  domainLabel: string;
  domain: Domain;
  public: boolean;
}

export interface ContactInfo {
  email: string;
  firstName: string;
  lastName: string;
}

export interface ContactListFilters extends Filters {
  domainUuid?: string;
  ownerUuid?: string;
  memberMail?: string;
}

export interface ContactListParameters {
  domainUuid?: string;
  ownerUuid?: string;
  memberMail?: string;
  page?: number;
  size?: number;
  sortOrder?: SORT_ORDER;
  sortField?: string;
}
