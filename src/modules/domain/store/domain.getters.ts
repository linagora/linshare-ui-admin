import { GetterTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<DomainState, RootState> = {
  getDomainsTree: state => state.domainsTree,
  getCurrentDomain: state => state.currentDomain
};

export default getters;
