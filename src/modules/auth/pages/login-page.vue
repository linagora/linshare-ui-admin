<template>
  <a-row class="login" type="flex" justify="center" align="top">
    <a-col :xs="20" :md="10" :lg="8" :xl="6" :xxl="4">
      <img class="logo" src="@/assets/images/linshare-logo-white.svg" />
      <p class="tagline">
        {{ $t('AUTH.TAGLINE') }}
      </p>
      <a-card>
        <h2>{{ $t('AUTH.LOGIN_TO_ADMIN') }}</h2>
        <a-form layout="vertical" :model="credentials" @submit="logIn">
          <a-alert v-if="error" :message="error" type="error" />
          <a-form-item>
            <a-input v-model:value="credentials.email" placeholder="Email">
              <template #prefix>
                <UserOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password v-model:value="credentials.password" placeholder="Password">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>

          <div>
            <a-button style="width: 100%" type="primary" html-type="submit" :loading="loggingIn">
              {{ $t('AUTH.LOGIN') }}
            </a-button>
          </div>
        </a-form>

        <div v-if="oidcEnabled" class="sso-login">
          <small>{{ $t('GENERAL.OR') }}</small>
          <a-button type="primary" @click="loginOIDC">
            {{ $t('AUTH.LOGIN_SSO') }}
          </a-button>
        </div>
      </a-card>
      <TheCopyright />
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import TheCopyright from '@/core/components/the-copyright.vue';
import { signinRedirect } from '@/modules/auth/services/oidc';
import { APIError } from '@/core/types/APIError';
import { LoginCredentials, login } from '../services/basic';
import config from '@/config';
import { useAuth2FAStore } from '@/modules/auth/store/auth2FAstore';

const props = defineProps<{ redirect?: string }>();
const router = useRouter();
const auth2FAStore = useAuth2FAStore();
const error = ref('');
const oidcEnabled = config.oidcEnabled;
const loggingIn = ref(false);
const credentials = reactive<LoginCredentials>({
  email: '',
  password: '',
});

function handleError(e: APIError) {
  if (e.isOTPMissingError()) {
    auth2FAStore.setCredentials(credentials.email.trim(), credentials.password, props.redirect);
    return router.push({ name: 'LoginUsingSecondFactorAuthentication' });
  }
  error.value = e.getMessage();
}

function loginOIDC() {
  signinRedirect();
}

async function logIn() {
  try {
    loggingIn.value = true;

    await login({ email: credentials.email.trim(), password: credentials.password });
    router.push(props.redirect || '/');
  } catch (error) {
    if (error instanceof APIError) {
      handleError(error);
    } else {
      console.error(error);
    }
  } finally {
    loggingIn.value = false;
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: @primary-color;
  height: 100vh;
  text-align: center;

  .logo {
    padding-top: 60px;
    width: 280px;
  }

  .tagline {
    margin-bottom: 15px;
    margin-top: 10px;
    color: @text-color-inverse;
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

  .sso-login {
    margin-top: 10px;
    display: flex;
    flex-flow: column;

    button {
      margin-top: 5px;
    }
  }
}
</style>
