import { defineStore } from 'pinia';
import { getUser, updateUser, deleteUser } from '@/modules/user/services/user-api';
import type User from '@/modules/user/types/User';

export interface UserState {
  user: User | null;
}

export const useUserStore = defineStore('userStore', {
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    async fetchUser(id: string) {
      try {
        const user = await getUser(id);

        this.user = user;
      } catch {
        this.user = null;
      }
    },

    async updateUser(payload: User) {
      const updatedUser = await updateUser(payload);
      this.user = {
        ...this.user,
        ...updatedUser,
      };
    },

    async deleteUser(payload: User) {
      await deleteUser(payload);

      this.user = null;
    },

    setUser(payload: User) {
      this.user = payload;
    },
    dehydrate(): void {
      this.user = null;
    },
  },
});
