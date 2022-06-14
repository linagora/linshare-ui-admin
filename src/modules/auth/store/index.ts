import { defineStore } from 'pinia';
import { AxiosRequestConfig } from 'axios';
import User from '@/modules/user/types/User';
import SecondFactorAuthentication from '@/modules/auth/types/SecondFactorAuthentication';
import { create2FAKey, get2FAStatus, getAuthorizedUser, remove2FAKey } from '@/modules/auth/services/auth-api';

interface AuthState {
  loggedUser: User | null;
  secondFA: SecondFactorAuthentication | null;
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    loggedUser: null,
    secondFA: null,
  }),
  getters: {
    loggedUserFullName: (state): string =>
      `${state.loggedUser?.firstName || ''} ${state.loggedUser?.lastName || ''}`.trim(),
  },
  actions: {
    async fetchLoggedUser(config?: AxiosRequestConfig) {
      try {
        const loggedUser = await getAuthorizedUser(config);
        this.loggedUser = loggedUser;
      } catch (error) {
        this.loggedUser = null;
        throw error;
      }
    },
    async fetchSecondFA() {
      const loggedUserUuid = this.loggedUser?.uuid;

      if (!loggedUserUuid) {
        return;
      }

      try {
        const secondFA = await get2FAStatus(loggedUserUuid);
        this.secondFA = secondFA;
      } catch (error) {
        this.secondFA = null;

        throw error;
      }
    },
    async createSecondFA() {
      const secondFA = await create2FAKey();
      this.secondFA = secondFA;
    },
    async removeSecondFA() {
      const loggedUserUuid = this.loggedUser?.uuid;

      if (!loggedUserUuid) {
        return;
      }

      try {
        const secondFA = await remove2FAKey(loggedUserUuid);
        this.secondFA = secondFA;
      } catch (error) {
        this.secondFA = null;
        throw error;
      }
    },
    dehydrate(): void {
      this.loggedUser = null;
      this.secondFA = null;
    },
  },
});
