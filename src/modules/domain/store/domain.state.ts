import Status from '@/core/types/Status';
import Domain, { EMPTY_DOMAIN } from '@/modules/domain/type/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/type/DomainTreeNode';

export interface DomainState {
  currentDomain: Domain;
  domainsTree: DomainTreeNode;
  status: {
    currentDomain: Status;
    domainsTree: Status;
  };
}

const state: DomainState = {
  currentDomain: EMPTY_DOMAIN,
  domainsTree: EMPTY_DOMAIN_NODE,
  status: {
    currentDomain: Status.LOADING,
    domainsTree: Status.LOADING
  }
};

export default state;
