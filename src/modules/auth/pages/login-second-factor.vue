<template>
  <a-row class="login" type="flex" justify="center" align="top">
    <a-col :xs="20" :md="10" :lg="8" :xl="6">
      <img class="logo" src="@/assets/images/linshare-logo-white.svg" />
      <p class="tagline">
        {{ $t('AUTH.TAGLINE') }}
      </p>
      <a-card>
        <h2>{{ $t('AUTH.SECOND_FACTOR_AUTHENTICATION') }}</h2>
        <p>{{ $t('AUTH.ENTER_OTP_DIGITS') }}</p>
        <a-form layout="vertical" @submit="logInWithOtp">
          <a-alert v-if="error" :message="error" type="error" />
          <a-form-item>
            <OtpInput :value="otp" @input="changeOtp" />
          </a-form-item>
          <a-button type="primary" html-type="submit" :loading="submitting">
            {{ $t('AUTH.LOGIN') }}
          </a-button>
        </a-form>
      </a-card>
      <TheCopyright />
    </a-col>
  </a-row>
</template>

<script lang="ts">
import router from '@/core/router';
import { defineComponent, ref } from 'vue';

import TheCopyright from '@/core/components/the-copyright.vue';
import OtpInput from '@/core/components/otp-input.vue';
import { APIError } from '@/core/types/APIError';
import { login } from '../services/basic';

interface Props {
  email: string;
  password: string;
  redirect: string;
}

export default defineComponent({
  name: 'LoginSecondFactor',
  components: {
    TheCopyright,
    OtpInput,
  },
  props: {
    email: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
    redirect: {
      type: String,
      default: '',
    },
  },
  setup(props: Props) {
    const error = ref('');
    const submitting = ref(false);
    const otp = ref('');

    function changeOtp(value: string) {
      otp.value = value;
    }

    async function logInWithOtp() {
      try {
        submitting.value = true;

        await login({
          email: props.email,
          password: props.password,
          otp: otp.value,
        });
        router.push(props.redirect || '/');
      } catch (e) {
        error.value = (e as APIError).getMessage();
      } finally {
        submitting.value = false;
      }
    }

    return {
      otp,
      error,
      changeOtp,
      logInWithOtp,
      submitting,
    };
  },
});
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
}
</style>
