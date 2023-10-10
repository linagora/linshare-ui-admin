import Domain from '@/core/types/Domain';
import User from '@/modules/user/types/User';

export interface Contact {
  identifier: string;
  description: string;
  owner: User;
  contacts: User[];
  uuid: string;
  domainId: string;
  domain: Domain;
  public: boolean;
}
