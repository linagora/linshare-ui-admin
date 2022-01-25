import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { computed, watchEffect } from 'vue';
import { isEnable } from '@/core/utils/functionality';
import SecondFactorAuthentication from '../types/SecondFactorAuthentication';

export default function use2FARequiredCheck () {
  const store = useStore();
  const { push, currentRoute } = useRouter();
  const { t } = useI18n();
  const secondFAAuth = computed<SecondFactorAuthentication>(() => store.getters['Auth/getSecondFA']);
  const secondFAEnabled = computed(() => {
    const functionality = store.getters['Domain/getLoggedUserFunctionality']('SECOND_FACTOR_AUTHENTICATION');

    return isEnable(functionality);
  });

  watchEffect(() => {
    if (
      secondFAEnabled.value &&
      !secondFAAuth.value.enabled &&
      secondFAAuth.value.required &&
      currentRoute.value.name !== 'ManageSecondFactorAuthentication' &&
      currentRoute.value.meta.requiresAuth
    ) {
      Modal.info({
        keyboard: false,
        title: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.TITLE'),
        content: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.MESSAGE'),
        okText: () => t('2FA.KEY_CREATION.FORCE_CREATION_MODAL.OK_BUTTON'),
        onOk: () => push({ name: 'ManageSecondFactorAuthentication' })
      });
    }
  });
}
