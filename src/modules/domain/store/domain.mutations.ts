import Status from '@/core/types/Status';
import Domain from '@/modules/domain/type/Domain';
import DomainTreeNode from '@/modules/domain/type/DomainTreeNode';
import { DomainState } from './domain.state';

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
  }
};
