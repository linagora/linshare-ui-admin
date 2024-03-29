<template>
  <a-popover trigger="click">
    <template #content>
      <div class="content">
        <label>{{ $t('2FA.MANUAL_SETUP.LABEL') }}</label>
        <span class="step">{{ $t('2FA.MANUAL_SETUP.STEP_1') }}</span>
        <span class="step">{{ $t('2FA.MANUAL_SETUP.STEP_2') }}</span>
        <div class="issuer-account">
          <img src="@/assets/images/freeotp-app-icon.png" />
          <div class="text-fields">
            <span>{{ configs.issuer }}</span>
            <span>{{ configs.account }}</span>
          </div>
        </div>
        <span class="step">{{ $t('2FA.MANUAL_SETUP.STEP_3') }}</span>
        <div class="otp-secret">
          <a-input :value="configs.secret" disabled />
          <a-button type="primary" @click="copySecret()">
            {{ $t('GENERAL.COPY') }}
          </a-button>
        </div>
        <span class="step">{{ $t('2FA.MANUAL_SETUP.STEP_4') }}</span>
        <div class="other-configs">
          <span
            ><i>
              {{ $t('2FA.MANUAL_SETUP.TYPE') }}
              <b style="text-transform: uppercase">{{ configs.type }}</b>
            </i></span
          >
          <span
            ><i>
              {{ $t('2FA.MANUAL_SETUP.DIGITS') }}
              <b>{{ configs.digits }}</b>
            </i></span
          >
          <span
            ><i>
              {{ $t('2FA.MANUAL_SETUP.ALGORITHM') }}
              <b>{{ configs.algorithm }}</b>
            </i></span
          >
          <span
            ><i>
              {{ $t('2FA.MANUAL_SETUP.INTERVAL') }}
              <b>{{ configs.period }}</b>
            </i></span
          >
        </div>
        <span class="step">{{ $t('2FA.MANUAL_SETUP.STEP_5') }}</span>
      </div>
    </template>

    <a class="trigger-text">{{ $t('2FA.KEY_CREATION.CAN_NOT_SCAN') }}</a>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import OtpSetupHintConfigs from '@/modules/auth/types/OtpSetupHintConfigs';

interface OtpSetupHintProps {
  configs: OtpSetupHintConfigs;
}

export default defineComponent({
  name: 'OtpSetupHint',
  props: {
    configs: {
      type: Object as () => OtpSetupHintConfigs,
      required: true,
    },
  },
  setup(props: OtpSetupHintProps) {
    async function copySecret() {
      if (!navigator.clipboard) {
        return;
      }

      try {
        await navigator.clipboard.writeText(props.configs.secret);
      } catch (err) {
        console.error('Failed to copy!', err);
      }
    }

    return { copySecret };
  },
});
</script>

<style lang="less" scoped>
.trigger-text {
  color: @primary-5;
  font-weight: 500;
  font-size: 14px;
}

.otp-secret {
  display: flex;
  align-items: center;
  width: 100%;

  input {
    flex: 1;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  button {
    white-space: nowrap;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.content {
  color: @text-color;
  display: flex;
  align-items: flex-start;
  flex-direction: column;

  label {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .step {
    margin: 7px 0;
  }

  .issuer-account {
    display: flex;
    background-color: @component-background;
    padding: 5px;
    border-radius: 2px;

    .text-fields {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-evenly;
      width: 100%;
      margin-left: 10px;

      span {
        border-bottom: medium;
        font-weight: 500;
        width: 100%;
        border-bottom: 1px solid @border-color-base;
      }
    }
  }

  .other-configs {
    display: flex;
    flex-direction: column;
    color: @text-color-medium;
  }
}
</style>
