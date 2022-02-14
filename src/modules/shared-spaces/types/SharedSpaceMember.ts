import SharedSpace, { SHARED_SPACE_TYPE } from './SharedSpace';
import SharedSpaceAccount from './SharedSpaceAccount';
import SharedSpaceRole from './SharedSpaceRole';

export default interface SharedSpaceMember {
  uuid: string;
  type?: SHARED_SPACE_TYPE
  nested?: boolean;
  node: Partial<SharedSpace>;
  nestedRole?: Omit<SharedSpaceRole, 'enabled'>;
  role: Omit<SharedSpaceRole, 'enabled'>;
  account: SharedSpaceAccount;
  creationDate?: number;
  modificationDate?: number;
}

export const EMPTY_SHARED_SPACE_MEMBER: SharedSpaceMember = {
  uuid: '',
  node: {},
  role: {
    name: '',
    type: 'WORK_GROUP',
    uuid: ''
  },
  account: {
    firstName: '',
    lastName: '',
    mail: '',
    uuid: ''
  }
};
