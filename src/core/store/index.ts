import { createStore } from 'vuex';
import Auth from '@/modules/auth/store';
import Domain from '@/modules/domain/store';
import RootState from './RootState';

export default createStore({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    Auth,
    Domain
  }
});
