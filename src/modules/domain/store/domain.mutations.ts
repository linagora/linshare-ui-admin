import Status from '@/core/types/Status';
import Domain from '@/modules/domain/type/Domain';
import DomainTreeNode from '@/modules/domain/type/DomainTreeNode';
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
  setDomainsTree (state: DomainState, tree: DomainTreeNode) {
    state.domainsTree = tree;
  },
  setCurrentDomain (state: DomainState, domain: Domain) {
    state.currentDomain = { ...state.currentDomain, ...domain };
  },
  setCurrentDomainStatus (state: DomainState, status: Status) {
    state.status.currentDomain = status;
  },
  setDomainsTreeStatus (state: DomainState, status: Status) {
    state.status.domainsTree = status;
  },
  setDomainNameInTree (state: DomainState, domain: Domain) {
    updateDomainName(state.domainsTree, domain);
  }
};
