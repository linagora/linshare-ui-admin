import { GetterTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<DomainState, RootState> = {
  getCurrentDomain: state => state.currentDomain,
  getDomainsTree: state => state.domainsTree,
  getStatus: state => (entity: 'currentDomain' | 'domainsTree') => state.status[entity],
  isRootDomain: state => state.currentDomain.type === 'ROOTDOMAIN',
  isGuestDomain: state => state.currentDomain.type === 'GUESTDOMAIN'
};

export default getters;
