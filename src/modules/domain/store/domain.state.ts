import Status from '@/core/types/Status';
import Domain, { EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';
import { Functionality } from '@/core/types/Functionality';

export interface DomainState {
  currentDomain: Domain;
  currentDomainFunctionalities: Functionality[];
  loggedUserFunctionalities?: Functionality[];
  domainsTree: DomainTreeNode;
  status: {
    currentDomain: Status;
    currentDomainFunctionalities: Status;
  };
}

const state: DomainState = {
  currentDomain: EMPTY_DOMAIN,
  currentDomainFunctionalities: [],
  domainsTree: EMPTY_DOMAIN_NODE,
  status: {
    currentDomain: Status.LOADING,
    currentDomainFunctionalities: Status.LOADING,
  },
};

export default state;
