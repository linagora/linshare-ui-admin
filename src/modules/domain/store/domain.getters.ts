import { GetterTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<DomainState, RootState> = {
  getCurrentDomain: state => state.currentDomain,
  getDomainsTree: state => state.domainsTree,
  getStatus: state => (entity: 'currentDomain' | 'domainsTree') => state.status[entity]
};

export default getters;
