import { createStore } from 'vuex';
import Auth from '@/modules/auth/store';
import RootState from './RootState';

export default createStore({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    Auth
  }
});
