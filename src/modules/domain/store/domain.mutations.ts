import Status from '@/core/types/Status';
import Domain, { EMPTY_DOMAIN } from '@/modules/domain/types/Domain';
import DomainTreeNode, { EMPTY_DOMAIN_NODE } from '@/modules/domain/types/DomainTreeNode';
import { Functionality } from '@/core/types/Functionality';
import { DomainState } from './domain.state';

function updateDomainName (domain: DomainTreeNode, updated: Domain) {
  if (domain.uuid === updated.uuid) {
    domain.name = updated.name;

    return;
  }

  if (domain.children) {
    for (let index = 0; index < domain.children.length; index++) {
      updateDomainName(domain.children[index], updated);
    }
  }
}

export default {
  dehydrate (state: DomainState) {
    state.currentDomain = EMPTY_DOMAIN;
    state.domainsTree = EMPTY_DOMAIN_NODE;
    state.loggedUserFunctionalities = undefined;
    state.status = {
      currentDomain: Status.LOADING
    };
  },
  setDomainsTree (state: DomainState, tree: DomainTreeNode) {
    state.domainsTree = tree;
  },
  setCurrentDomain (state: DomainState, domain: Domain) {
    state.currentDomain = { ...state.currentDomain, ...domain };
  },
  setCurrentDomainStatus (state: DomainState, status: Status) {
    state.status.currentDomain = status;
  },
  setDomainNameInTree (state: DomainState, domain: Domain) {
    updateDomainName(state.domainsTree, domain);
  },
  setLoggedUserFunctionalities (state: DomainState, functionalities: Functionality[]) {
    state.loggedUserFunctionalities = functionalities;
  }
};
