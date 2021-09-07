<template>
  <a-row class="login" type="flex" justify="center" align="top">
    <a-col :xs="20" :md="10" :lg="8" :xl="6">
      <img class="logo" src="@/assets/linshare-icon.png">
      <a-card>
        <h2>{{ $t('AUTH.LOGIN_TO_ADMIN') }}</h2>
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
            :loading="loggingIn"
          >
            {{ $t('AUTH.LOGIN') }}
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
import { useI18n } from 'vue-i18n';

import Copyright from '@/core/components/Copyright.vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { AuthError } from '../services/AuthAPIClient';

export default defineComponent({
  name: 'Login',
  components: {
    LockOutlined,
    UserOutlined,
    Copyright
  },
  props: {
    redirect: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const store = useStore();
    const { t } = useI18n();
    const error = ref('');
    const loggingIn = ref(false);
    const credentials = reactive({
      email: '',
      password: ''
    });

    function handleError (e: AuthError) {
      if (e.isOTPRequiredError()) {
        return router.push({
          name: 'LoginUsingSecondFactorAuthentication',
          params: {
            ...credentials,
            redirect: props.redirect
          }
        });
      }

      error.value = t(e.message) || t('ERRORS.COMMON_MESSAGE');
    }

    async function logIn () {
      try {
        loggingIn.value = true;
        await store.dispatch('Auth/fetchLoggedUser', {
          auth: {
            username: credentials.email,
            password: credentials.password
          }
        });

        router.push(props.redirect || '/');
      } catch (e) {
        handleError(e);
      } finally {
        loggingIn.value = false;
      }
    }

    return {
      credentials,
      error,
      logIn,
      loggingIn
    };
  }
});
</script>

<style lang="less" scoped>
  .login {
    background-color: @primary-color;
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
      color: @primary-1;
    }

    h2 {
      color: @text-color-primary-heavy;
      font-weight: 600;
    }
  }
</style>
