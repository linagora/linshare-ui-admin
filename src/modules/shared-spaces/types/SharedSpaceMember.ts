import SharedSpace, { SHARED_SPACE_TYPE } from './SharedSpace';
import SharedSpaceAccount from './SharedSpaceAccount';
import SharedSpaceRole from './SharedSpaceRole';

export default interface SharedSpaceMember {
  uuid: string;
  type?: SHARED_SPACE_TYPE
  nested?: boolean;
  node: Partial<SharedSpace>;
  role: Omit<SharedSpaceRole, 'enabled'>;
  account: SharedSpaceAccount;
  creationDate?: number;
  modificationDate?: number;
}
