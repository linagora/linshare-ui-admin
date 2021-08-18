import Domain from '@/modules/domain/type/Domain';
import DomainTreeNode from '@/modules/domain/type/DomainTreeNode';
export interface DomainState {
  domainsTree: DomainTreeNode | {};
  currentDomain: Domain | {};
}

const state: DomainState = {
  currentDomain: {},
  domainsTree: {}
};

export default state;
