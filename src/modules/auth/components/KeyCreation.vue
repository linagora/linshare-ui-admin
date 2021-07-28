<template>
  <a-alert
    v-if="!secondFA.enabled && secondFA.required"
    type="warning"
    :message="$t('2FA.KEY_CREATION.ALERT.TITLE')"
    :description="$t('2FA.KEY_CREATION.ALERT.MESSAGE')"
  />

  <div class="second-fa-management">
    <span class="helper-text">{{ $t('2FA.KEY_CREATION.HELPER') }}</span>
    <div class="instruction">
      <span class="instruction__number">1</span>
      <span class="instruction__text">{{ $t('2FA.KEY_CREATION.STEP_1') }}</span>
    </div>

    <div class="install-links">
      <div class="link">
        <div class="qrcode-ctn">
          <qrcode-vue :value="OTP_APP_INSTALL_LINKS.appStore" size="160" level="H"/>
          <img src="@/assets/images/app-store.svg"/>
        </div>
        <a :href="OTP_APP_INSTALL_LINKS.appStore" target="_blank">{{ $t('2FA.KEY_CREATION.APP_STORE') }}</a>
      </div>

      <div class="link">
        <div class="qrcode-ctn">
          <qrcode-vue :value="OTP_APP_INSTALL_LINKS.googlePlay" size="160" level="H"/>
          <img src="@/assets/images/google-play.svg"/>
        </div>
        <a :href="OTP_APP_INSTALL_LINKS.googlePlay" target="_blank">{{ $t('2FA.KEY_CREATION.GOOGLE_PLAY') }}</a>
      </div>
    </div>

    <div class="instruction">
      <span class="instruction__number">2</span>
      <span class="instruction__text">{{ $t('2FA.KEY_CREATION.STEP_2') }}</span>
    </div>
    <a-button
      v-if="!secondFA.enabled"
      type="primary"
      class="button"
      @click="create2FAKey"
    >
      {{ $t('2FA.KEY_CREATION.BUTTON') }}
    </a-button>

    <div class="shared-key">
      <small v-if="secondFA.sharedKey">{{ $t('2FA.KEY_REMOVAL.INFORMATION', { date:  $d(secondFA.creationDate, 'mediumDate') }) }}</small>

      <div class="qrcode-ctn">
        <qrcode-vue v-if="secondFA.sharedKey" :value="freeOtpUri" size="160" level="H"/>
        <img src="@/assets/images/freeotp.svg"/>
      </div>

      <OtpSetupHint v-if="secondFA.sharedKey" :configs="otpConfigs"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { message } from 'ant-design-vue';
import QrcodeVue from 'qrcode.vue';
import OtpSetupHint from './OtpSetupHint.vue';

import { OTP_DEFAULT_CONFIGURATION, OTP_APP_INSTALL_LINKS } from '../constants';

export default defineComponent({
  name: 'KeyCreation',
  components: {
    QrcodeVue,
    OtpSetupHint
  },
  setup () {
    const store = useStore();
    const { locale, t } = useI18n();
    const loggedUser = store.getters['Auth/getLoggedUser'];
    const secondFA = computed(() => store.getters['Auth/getSecondFA']);
    const otpConfigs = computed(() => ({
      ...OTP_DEFAULT_CONFIGURATION,
      account: loggedUser.mail,
      secret: secondFA.value.sharedKey
    }));
    const freeOtpUri = computed(() =>
      `otpauth://${otpConfigs.value.type}/` +
      `${otpConfigs.value.issuer}:${otpConfigs.value.account}` +
      `?secret=${otpConfigs.value.secret}` +
      `&algorithm=${otpConfigs.value.algorithm}` +
      `&digits=${otpConfigs.value.digits}` +
      `&period=${otpConfigs.value.period}`
    );

    async function create2FAKey () {
      try {
        await store.dispatch('Auth/createSecondFA');
      } catch (error) {
        message.error(t('2FA.KEY_CREATION.MESSAGE.ERROR'));
      }
    }

    return {
      locale,
      otpConfigs,
      freeOtpUri,
      create2FAKey,
      secondFA,
      OTP_APP_INSTALL_LINKS
    };
  }
});
</script>

<style lang="less" scoped>
.shared-key {
  .qrcode-ctn {
    margin-bottom: 10px;
  }
}
</style>
