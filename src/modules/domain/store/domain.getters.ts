import { GetterTree } from 'vuex';
import { DomainState } from './domain.state';
import RootState from '@/core/store/RootState';

const getters: GetterTree<DomainState, RootState> = {
  getDomains: state => state.domains
};

export default getters;
