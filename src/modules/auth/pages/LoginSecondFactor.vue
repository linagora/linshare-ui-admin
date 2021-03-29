<template>
  <a-row class="login" type="flex" justify="center" align="top">
    <a-col :xs="20" :md="10" :lg="8" :xl="6">
      <img class="logo" src="@/assets/linshare-icon.png">
      <a-card>
        <h2>{{ $t('AUTH.SECOND_FACTOR_AUTHENTICATION') }}</h2>
        <p>{{ $t('AUTH.ENTER_OTP_DIGITS') }}</p>
        <a-form layout="vertical" :model="credentials" @submit="logInWithOtp">
          <a-alert v-if="error" :message="error" type="error" />
          <a-form-item>
            <OtpInput :value='otp' @input="changeOtp"/>
          </a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
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
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import Copyright from '@/core/components/Copyright.vue';
import OtpInput from '@/core/components/OtpInput.vue';
import { AuthError } from '../services/AuthAPIClient';

interface LoginSecondFactorProps {
  email: string;
  password: string;
  redirect: string;
}

export default defineComponent({
  name: 'Login',
  components: {
    Copyright,
    OtpInput
  },
  props: {
    email: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      default: ''
    },
    redirect: {
      type: String,
      default: ''
    }
  },
  setup (props: LoginSecondFactorProps) {
    const store = useStore();
    const { t } = useI18n();
    const error = ref('');
    const submitting = ref(false);
    const otp = ref('');

    function changeOtp (value: string) {
      otp.value = value;
    }

    function handleError (e: AuthError) {
      error.value = t(e.message) || t('ERRORS.COMMON_MESSAGE');
    }

    async function logInWithOtp () {
      try {
        submitting.value = true;
        await store.dispatch('Auth/fetchLoggedUser', {
          auth: {
            username: props.email,
            password: props.password
          },
          headers: {
            'x-linShare-2fa-pin': otp.value
          }
        });

        submitting.value = false;
        router.push(props.redirect || '/');
      } catch (e) {
        submitting.value = false;
        handleError(e);
      }
    }

    return {
      error,
      changeOtp,
      logInWithOtp,
      submitting
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

  h2 {
    color: #1B4157;
    font-weight: 600;
  }

  p {
    color: #333;
  }
}
</style>
