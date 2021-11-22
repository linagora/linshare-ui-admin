import Status from '@/core/types/Status';
import Domain, { EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';

export interface DomainState {
  currentDomain: Domain;
  domainsTree: DomainTreeNode;
  status: {
    currentDomain: Status;
  };
}

const state: DomainState = {
  currentDomain: EMPTY_DOMAIN,
  domainsTree: EMPTY_DOMAIN_NODE,
  status: {
    currentDomain: Status.LOADING
  }
};

export default state;
