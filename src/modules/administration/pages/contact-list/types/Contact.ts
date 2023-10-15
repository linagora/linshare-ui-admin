import Domain from '@/core/types/Domain';
import User from '@/modules/user/types/User';

export interface Contact {
  identifier: string;
  description: string;
  owner: User;
  contacts: ContactInfo[];
  uuid: string;
  domainId: string;
  domain: Domain;
  public: boolean;
}

export interface ContactInfo {
  email: string;
  firstName: string;
  lastName: string;
}
