import { defineStore } from 'pinia';

interface Auth2FAState {
  email: string;
  password: string;
  redirect?: string;
}

export const useAuth2FAStore = defineStore('useAuth2FAStore', {
  state: (): Auth2FAState => ({
    email: '',
    password: '',
    redirect: '',
  }),
  actions: {
    setCredentials(email: string, password: string, redirect = ''): void {
      this.email = email;
      this.password = password;
      this.redirect = redirect;
    },
    dehydrate(): void {
      this.email = '';
      this.password = '';
      this.redirect = '';
    },
  },
});
