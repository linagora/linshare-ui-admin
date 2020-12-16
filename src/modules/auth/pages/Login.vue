<template>
  <a-row class="login" type="flex" justify="center" align="top">
    <a-col :xs="20" :md="10" :lg="8" :xl="6">
      <img class="logo" src="@/assets/linshare-icon.png">
      <a-card>
        <h2>Login to Admin</h2>
        <a-form layout="vertical" :model="credentials" @submit="logIn">
          <a-alert v-if="error" :message="error" type="error" />
          <a-form-item>
            <a-input placeholder="Email" v-model:value="credentials.email">
              <template #prefix>
                <user-outlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password placeholder="Password" v-model:value="credentials.password">
              <template #prefix>
                <lock-outlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-button
            type="primary"
            html-type="submit"
          >
            Log in
          </a-button>
        </a-form>
      </a-card>
      <Copyright />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import router from '@/core/router';
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';

import Copyright from '@/core/components/Copyright.vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Login',
  components: {
    LockOutlined,
    UserOutlined,
    Copyright
  },
  setup () {
    const store = useStore();
    const error = ref('');
    const credentials = reactive({
      email: '',
      password: ''
    });

    async function logIn () {
      try {
        await store.dispatch('Auth/fetchLoggedUser', {
          auth: {
            username: credentials.email,
            password: credentials.password
          }
        });

        router.push('/');
      } catch (e) {
        error.value = e.response.status === 401
          ? 'Invalid login credentials'
          : 'Unexpected error happened';
      }
    }

    return {
      credentials,
      error,
      logIn
    };
  }
});
</script>

<style lang="less" scoped>
.login {
  background-color: #0372b3;
  height: 100vh;
  text-align: center;

  .logo {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .ant-alert {
    margin-bottom: 10px;
  }

  .copyright {
    margin-top: 10px;
    font-weight: 500;
    size: 12px;
    color: #CDEFFF;
  }
}
</style>
